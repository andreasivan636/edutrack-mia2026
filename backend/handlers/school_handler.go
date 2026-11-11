package handlers

import (
	"fmt"
	"math"
	"strings"
	"time"

	"edu-track-backend/database"
	"edu-track-backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func hydrateBrief(school *models.School) {
	if len(school.AiAssessorBrief.MandatoryInvestigationFocus) == 0 {
		focus := make([]string, 0)
		if school.AiAssessorBrief.MandatoryFocus1 != "" {
			focus = append(focus, school.AiAssessorBrief.MandatoryFocus1)
		}
		if school.AiAssessorBrief.MandatoryFocus2 != "" {
			focus = append(focus, school.AiAssessorBrief.MandatoryFocus2)
		}
		if school.AiAssessorBrief.MandatoryFocus3 != "" {
			focus = append(focus, school.AiAssessorBrief.MandatoryFocus3)
		}
		school.AiAssessorBrief.MandatoryInvestigationFocus = focus
	}

	if len(school.AiAssessorBrief.Flags) == 0 {
		if school.AiAssessorBrief.FlagsString != "" {
			school.AiAssessorBrief.Flags = strings.Split(school.AiAssessorBrief.FlagsString, ",")
		} else {
			school.AiAssessorBrief.Flags = []string{}
		}
	}

	if school.StageDetails == nil {
		school.StageDetails = []models.AccreditationStageItem{}
	}
	if school.RadarStandards == nil {
		school.RadarStandards = []models.RadarStandardItem{}
	}
	if school.CitizenReports == nil {
		school.CitizenReports = []models.CitizenReportItem{}
	}
}

func rebuildStages(schoolID string, stageNum int, slaStatus models.SlaStatus) []models.AccreditationStageItem {
	meta := []struct {
		num  int
		name string
		max  int
	}{
		{1, "Submit Berkas Sispena", 14},
		{2, "Verifikasi Berkas Provinsi", 10},
		{3, "Penugasan Tim Asesor", 14},
		{4, "Visitasi Lapangan", 10},
		{5, "Pleno & Terbit Sertifikat SK", 14},
	}

	out := make([]models.AccreditationStageItem, 0, 5)
	for _, m := range meta {
		status := "pending"
		days := 0
		if m.num < stageNum {
			status = "completed"
			days = m.max - 3
		} else if m.num == stageNum {
			if slaStatus == models.SlaOverdue {
				status = "overdue"
				days = m.max + 14
			} else {
				status = "in_progress"
				days = 5
			}
		}
		out = append(out, models.AccreditationStageItem{
			SchoolID:    schoolID,
			StageNumber: m.num,
			Name:        m.name,
			Status:      status,
			DaysSpent:   days,
			MaxSlaDays:  m.max,
		})
	}
	return out
}

// GetSchools returns a list of schools with optional filtering (PostgreSQL or Local Fallback Store)
func GetSchools(c *fiber.Ctx) error {
	search := strings.ToLower(strings.TrimSpace(c.Query("search")))
	level := c.Query("level")
	sla := c.Query("sla")
	aiRisk := c.Query("aiRisk")

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.RLock()
		defer database.LocalStore.RUnlock()

		filtered := make([]models.School, 0, len(database.LocalStore.Schools))
		for _, s := range database.LocalStore.Schools {
			if search != "" {
				match := strings.Contains(strings.ToLower(s.Name), search) ||
					strings.Contains(s.NPSN, search) ||
					strings.Contains(strings.ToLower(s.District), search) ||
					strings.Contains(strings.ToLower(s.City), search)
				if !match {
					continue
				}
			}
			if level != "" && level != "ALL" && string(s.Level) != level {
				continue
			}
			if sla != "" && sla != "ALL" && string(s.SlaStatus) != sla {
				continue
			}
			if aiRisk != "" && aiRisk != "ALL" && string(s.AiRiskLevel) != aiRisk {
				continue
			}
			sc := s
			hydrateBrief(&sc)
			filtered = append(filtered, sc)
		}
		return c.JSON(filtered)
	}

	query := database.DB.Preload("StageDetails").Preload("RadarStandards").Preload("CitizenReports")

	if search != "" {
		searchLike := "%" + search + "%"
		query = query.Where("LOWER(name) LIKE ? OR npsn LIKE ? OR LOWER(district) LIKE ? OR LOWER(city) LIKE ?", searchLike, searchLike, searchLike, searchLike)
	}
	if level != "" && level != "ALL" {
		query = query.Where("level = ?", level)
	}
	if sla != "" && sla != "ALL" {
		query = query.Where("sla_status = ?", sla)
	}
	if aiRisk != "" && aiRisk != "ALL" {
		query = query.Where("ai_risk_level = ?", aiRisk)
	}

	var schools []models.School
	if err := query.Order("created_at desc").Find(&schools).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to query schools: " + err.Error(),
		})
	}

	for i := range schools {
		hydrateBrief(&schools[i])
	}

	return c.JSON(schools)
}

// GetSchoolByID returns details for a specific school
func GetSchoolByID(c *fiber.Ctx) error {
	id := c.Params("id")

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.RLock()
		defer database.LocalStore.RUnlock()

		for _, s := range database.LocalStore.Schools {
			if s.ID == id || s.NPSN == id {
				sc := s
				hydrateBrief(&sc)
				return c.JSON(sc)
			}
		}
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": fmt.Sprintf("School with ID/NPSN '%s' not found", id),
		})
	}

	var school models.School
	err := database.DB.Preload("StageDetails").
		Preload("RadarStandards").
		Preload("CitizenReports").
		Where("id = ? OR npsn = ?", id, id).
		First(&school).Error

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": fmt.Sprintf("School with ID/NPSN '%s' not found", id),
		})
	}

	hydrateBrief(&school)
	return c.JSON(school)
}

// CreateSchool registers a new school into PostgreSQL or Local Store
func CreateSchool(c *fiber.Ctx) error {
	var school models.School
	if err := c.BodyParser(&school); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid school payload: " + err.Error(),
		})
	}

	if strings.TrimSpace(school.Name) == "" || strings.TrimSpace(school.NPSN) == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "School name and NPSN are required",
		})
	}

	if school.ID == "" {
		school.ID = "sch-" + uuid.New().String()[:8]
	}
	if school.CurrentStageNumber < 1 || school.CurrentStageNumber > 5 {
		school.CurrentStageNumber = 1
	}
	if school.SlaStatus == "" {
		school.SlaStatus = models.SlaOnTrack
	}
	if school.AccreditationGrade == "" {
		school.AccreditationGrade = "Dalam Proses"
	}
	if school.AiRiskLevel == "" {
		school.AiRiskLevel = models.RiskVerified
	}
	if len(school.StageDetails) == 0 {
		school.StageDetails = rebuildStages(school.ID, school.CurrentStageNumber, school.SlaStatus)
	}
	for i := range school.StageDetails {
		school.StageDetails[i].SchoolID = school.ID
	}
	for i := range school.RadarStandards {
		school.RadarStandards[i].SchoolID = school.ID
	}
	if len(school.AiAssessorBrief.MandatoryInvestigationFocus) > 0 {
		school.AiAssessorBrief.MandatoryFocus1 = school.AiAssessorBrief.MandatoryInvestigationFocus[0]
	}
	if len(school.AiAssessorBrief.MandatoryInvestigationFocus) > 1 {
		school.AiAssessorBrief.MandatoryFocus2 = school.AiAssessorBrief.MandatoryInvestigationFocus[1]
	}
	if len(school.AiAssessorBrief.MandatoryInvestigationFocus) > 2 {
		school.AiAssessorBrief.MandatoryFocus3 = school.AiAssessorBrief.MandatoryInvestigationFocus[2]
	}
	if len(school.AiAssessorBrief.Flags) > 0 {
		school.AiAssessorBrief.FlagsString = strings.Join(school.AiAssessorBrief.Flags, ",")
	}
	if school.CitizenReports == nil {
		school.CitizenReports = []models.CitizenReportItem{}
	}
	school.CreatedAt = time.Now()
	school.UpdatedAt = time.Now()

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.Lock()
		database.LocalStore.Schools = append([]models.School{school}, database.LocalStore.Schools...)
		database.LocalStore.Stats.TotalSchoolsTracked += 1
		if database.LocalStore.Stats.TotalSchoolsTracked > 0 {
			pct := float64(database.LocalStore.Stats.OverdueCount) / float64(database.LocalStore.Stats.TotalSchoolsTracked) * 100
			database.LocalStore.Stats.OverduePercentage = math.Round(pct*10) / 10
		}
		database.LocalStore.Save()
		database.LocalStore.Unlock()

		hydrateBrief(&school)
		return c.Status(fiber.StatusCreated).JSON(school)
	}

	if err := database.DB.Create(&school).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save new school: " + err.Error(),
		})
	}

	hydrateBrief(&school)
	return c.Status(fiber.StatusCreated).JSON(school)
}

// UpdateSchoolSLA updates accreditation stage (1-5), SLA status, and visitation date
func UpdateSchoolSLA(c *fiber.Ctx) error {
	schoolID := c.Params("id")

	type SlaPayload struct {
		CurrentStageNumber      int              `json:"currentStageNumber"`
		SlaStatus               models.SlaStatus `json:"slaStatus"`
		SlaDaysDifference       *int             `json:"slaDaysDifference"`
		ScheduledVisitationDate *string          `json:"scheduledVisitationDate"`
	}

	var payload SlaPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid SLA update payload",
		})
	}

	if payload.CurrentStageNumber < 1 || payload.CurrentStageNumber > 5 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "currentStageNumber must be between 1 and 5",
		})
	}

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.Lock()
		defer database.LocalStore.Unlock()

		for i := range database.LocalStore.Schools {
			s := &database.LocalStore.Schools[i]
			if s.ID == schoolID || s.NPSN == schoolID {
				wasOverdue := s.SlaStatus == models.SlaOverdue
				isNowOverdue := payload.SlaStatus == models.SlaOverdue

				s.CurrentStageNumber = payload.CurrentStageNumber
				s.SlaStatus = payload.SlaStatus
				if payload.SlaDaysDifference != nil {
					s.SlaDaysDifference = *payload.SlaDaysDifference
				} else if isNowOverdue {
					s.SlaDaysDifference = 14
				} else {
					s.SlaDaysDifference = -3
				}

				if payload.ScheduledVisitationDate != nil {
					if strings.TrimSpace(*payload.ScheduledVisitationDate) == "" {
						s.ScheduledVisitationDate = nil
					} else {
						val := strings.TrimSpace(*payload.ScheduledVisitationDate)
						s.ScheduledVisitationDate = &val
					}
				}

				s.StageDetails = rebuildStages(s.ID, s.CurrentStageNumber, s.SlaStatus)
				if s.AiRiskLevel != models.RiskHighDiscrepancy {
					if isNowOverdue {
						s.AiRiskLevel = models.RiskBottleneck
					} else {
						s.AiRiskLevel = models.RiskVerified
					}
				}
				s.UpdatedAt = time.Now()

				if wasOverdue != isNowOverdue {
					if isNowOverdue {
						database.LocalStore.Stats.OverdueCount += 1
					} else if database.LocalStore.Stats.OverdueCount > 0 {
						database.LocalStore.Stats.OverdueCount -= 1
					}
					pct := float64(database.LocalStore.Stats.OverdueCount) / math.Max(1, float64(database.LocalStore.Stats.TotalSchoolsTracked)) * 100
					database.LocalStore.Stats.OverduePercentage = math.Round(pct*10) / 10
				}

				database.LocalStore.Save()
				out := *s
				hydrateBrief(&out)
				return c.JSON(out)
			}
		}

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "School not found",
		})
	}

	var school models.School
	if err := database.DB.Preload("StageDetails").Preload("RadarStandards").Preload("CitizenReports").
		Where("id = ? OR npsn = ?", schoolID, schoolID).First(&school).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "School not found",
		})
	}

	school.CurrentStageNumber = payload.CurrentStageNumber
	school.SlaStatus = payload.SlaStatus
	if payload.SlaDaysDifference != nil {
		school.SlaDaysDifference = *payload.SlaDaysDifference
	} else if payload.SlaStatus == models.SlaOverdue {
		school.SlaDaysDifference = 14
	} else {
		school.SlaDaysDifference = -3
	}
	if payload.ScheduledVisitationDate != nil {
		if strings.TrimSpace(*payload.ScheduledVisitationDate) == "" {
			school.ScheduledVisitationDate = nil
		} else {
			v := strings.TrimSpace(*payload.ScheduledVisitationDate)
			school.ScheduledVisitationDate = &v
		}
	}
	if school.AiRiskLevel != models.RiskHighDiscrepancy {
		if payload.SlaStatus == models.SlaOverdue {
			school.AiRiskLevel = models.RiskBottleneck
		} else {
			school.AiRiskLevel = models.RiskVerified
		}
	}

	database.DB.Where("school_id = ?", school.ID).Delete(&models.AccreditationStageItem{})
	newStages := rebuildStages(school.ID, school.CurrentStageNumber, school.SlaStatus)
	school.StageDetails = newStages
	database.DB.Save(&school)

	hydrateBrief(&school)
	return c.JSON(school)
}

// CreateCitizenReport submits a new citizen report (status defaults to 'investigating' for Assessor moderation)
func CreateCitizenReport(c *fiber.Ctx) error {
	schoolID := c.Params("id")

	type RequestPayload struct {
		Author      string `json:"author"`
		AuthorRole  string `json:"authorRole"`
		FacilityTag string `json:"facilityTag"`
		Text        string `json:"text"`
		PhotoURL    string `json:"photoUrl"`
		Status      string `json:"status"`
	}

	var payload RequestPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if strings.TrimSpace(payload.Text) == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Text description cannot be empty",
		})
	}

	author := strings.TrimSpace(payload.Author)
	if author == "" {
		author = "Warga Anonim (Terverifikasi NIK)"
	}
	role := strings.TrimSpace(payload.AuthorRole)
	if role == "" {
		role = "Warga Sekitar"
	}
	status := payload.Status
	if status == "" {
		status = "investigating"
	}

	newReport := models.CitizenReportItem{
		ID:          "rep-" + uuid.New().String()[:8],
		Author:      author,
		AuthorRole:  role,
		Date:        time.Now().Format("2006-01-02"),
		FacilityTag: payload.FacilityTag,
		Text:        payload.Text,
		PhotoURL:    payload.PhotoURL,
		Upvotes:     1,
		Status:      status,
		CreatedAt:   time.Now(),
	}

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.Lock()
		defer database.LocalStore.Unlock()

		for i := range database.LocalStore.Schools {
			s := &database.LocalStore.Schools[i]
			if s.ID == schoolID || s.NPSN == schoolID {
				newReport.SchoolID = s.ID
				s.CitizenReports = append([]models.CitizenReportItem{newReport}, s.CitizenReports...)
				database.LocalStore.Stats.TotalCitizenReports += 1
				database.LocalStore.Save()
				return c.Status(fiber.StatusCreated).JSON(newReport)
			}
		}

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Target school not found",
		})
	}

	var school models.School
	if err := database.DB.Where("id = ? OR npsn = ?", schoolID, schoolID).First(&school).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Target school not found",
		})
	}

	newReport.SchoolID = school.ID
	if err := database.DB.Create(&newReport).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save citizen report: " + err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(newReport)
}

// VerifyCitizenReport allows Assessor/Admin to verify ('verified') or reject ('countered') a citizen report
func VerifyCitizenReport(c *fiber.Ctx) error {
	reportID := c.Params("id")

	type VerifyPayload struct {
		Status     string `json:"status"` // "verified" or "countered"
		VerifiedBy string `json:"verifiedBy"`
	}

	var payload VerifyPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid verification payload",
		})
	}

	if payload.Status != "verified" && payload.Status != "countered" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "status must be 'verified' or 'countered'",
		})
	}

	verifier := strings.TrimSpace(payload.VerifiedBy)
	if verifier == "" {
		verifier = "Dr. Hendra, M.Pd"
	}
	nowStamp := time.Now().Format("2006-01-02 15:04") + " WIB"

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.Lock()
		defer database.LocalStore.Unlock()

		for si := range database.LocalStore.Schools {
			s := &database.LocalStore.Schools[si]
			for ri := range s.CitizenReports {
				r := &s.CitizenReports[ri]
				if r.ID == reportID {
					prevStatus := r.Status
					r.Status = payload.Status
					r.VerifiedBy = verifier
					r.VerifiedAt = nowStamp

					if payload.Status == "verified" && prevStatus != "verified" {
						database.LocalStore.Stats.VerifiedReports += 1
						s.VerifiedScore = math.Max(38, math.Round((s.VerifiedScore-1.2)*10)/10)
						s.AiAssessorBrief.DiscrepancyRate = math.Max(0, math.Round((s.ClaimedScore-s.VerifiedScore)*10)/10)
						s.AiAssessorBrief.GeneratedAt = nowStamp
					} else if payload.Status == "countered" && prevStatus == "verified" && database.LocalStore.Stats.VerifiedReports > 0 {
						database.LocalStore.Stats.VerifiedReports -= 1
					}

					database.LocalStore.Save()
					scCopy := *s
					hydrateBrief(&scCopy)
					return c.JSON(fiber.Map{
						"report": *r,
						"school": scCopy,
						"stats":  database.LocalStore.Stats,
					})
				}
			}
		}

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Report not found",
		})
	}

	var report models.CitizenReportItem
	if err := database.DB.Where("id = ?", reportID).First(&report).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Report not found",
		})
	}

	report.Status = payload.Status
	report.VerifiedBy = verifier
	report.VerifiedAt = nowStamp
	database.DB.Save(&report)

	return c.JSON(fiber.Map{
		"report": report,
	})
}

// SubmitOfficialResponse records a 2-way feedback response from the school management / committee
func SubmitOfficialResponse(c *fiber.Ctx) error {
	reportID := c.Params("id")

	type ResponsePayload struct {
		FollowUpStatus string `json:"followUpStatus"`
		ResponderName  string `json:"responderName"`
		ResponderRole  string `json:"responderRole"`
		Text           string `json:"text"`
	}

	var payload ResponsePayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid response payload",
		})
	}

	nowStamp := time.Now().Format("2006-01-02 15:04") + " WIB"

	if database.DB == nil {
		if database.LocalStore == nil {
			database.InitLocalStore()
		}
		database.LocalStore.Lock()
		defer database.LocalStore.Unlock()

		for si := range database.LocalStore.Schools {
			s := &database.LocalStore.Schools[si]
			for ri := range s.CitizenReports {
				r := &s.CitizenReports[ri]
				if r.ID == reportID {
					r.FollowUpStatus = payload.FollowUpStatus
					r.OfficialResponse = &models.OfficialSchoolResponse{
						ResponderName: payload.ResponderName,
						ResponderRole: payload.ResponderRole,
						Text:          payload.Text,
						RespondedAt:   nowStamp,
					}
					database.LocalStore.Save()
					return c.JSON(fiber.Map{
						"report": *r,
					})
				}
			}
		}

		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Report not found",
		})
	}

	var report models.CitizenReportItem
	if err := database.DB.Where("id = ?", reportID).First(&report).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Report not found",
		})
	}

	report.FollowUpStatus = payload.FollowUpStatus
	report.OfficialResponse = &models.OfficialSchoolResponse{
		ResponderName: payload.ResponderName,
		ResponderRole: payload.ResponderRole,
		Text:          payload.Text,
		RespondedAt:   nowStamp,
	}
	database.DB.Save(&report)

	return c.JSON(fiber.Map{
		"report": report,
	})
}
