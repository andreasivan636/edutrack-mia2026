package models

import (
	"time"
)

type SchoolLevel string

const (
	LevelSD  SchoolLevel = "SD"
	LevelSMP SchoolLevel = "SMP"
	LevelSMA SchoolLevel = "SMA"
	LevelSMK SchoolLevel = "SMK"
)

type SlaStatus string

const (
	SlaOnTrack SlaStatus = "on_track"
	SlaWarning SlaStatus = "warning"
	SlaOverdue SlaStatus = "overdue"
)

type AiRiskLevel string

const (
	RiskVerified        AiRiskLevel = "verified"
	RiskBottleneck      AiRiskLevel = "bottleneck"
	RiskHighDiscrepancy AiRiskLevel = "high_discrepancy"
)

// School is the primary model for schools tracked in Edu Track
type School struct {
	ID                      string  `gorm:"primaryKey;type:varchar(64)" json:"id"`
	NPSN                    string  `gorm:"type:varchar(16);uniqueIndex;not null" json:"npsn"`
	Name                    string  `gorm:"type:varchar(255);not null" json:"name"`
	Level                   SchoolLevel `gorm:"type:varchar(8);not null" json:"level"`
	Provinsi                string  `gorm:"type:varchar(128)" json:"provinsi"`
	KabupatenKota           string  `gorm:"type:varchar(128)" json:"kabupatenKota"`
	Kecamatan               string  `gorm:"type:varchar(128)" json:"kecamatan"`
	District                string  `gorm:"type:varchar(128);not null" json:"district"`
	City                    string  `gorm:"type:varchar(128);not null" json:"city"`
	Address                 string  `gorm:"type:text" json:"address"`
	AccreditationGrade      string  `gorm:"type:varchar(16);not null" json:"accreditationGrade"`
	LastAccreditationYear   int     `json:"lastAccreditationYear"`
	CurrentStageNumber      int     `gorm:"default:1" json:"currentStageNumber"`
	SlaStatus               SlaStatus `gorm:"type:varchar(16);not null" json:"slaStatus"`
	SlaDaysDifference       int     `json:"slaDaysDifference"`
	ClaimedScore            float64 `json:"claimedScore"`
	VerifiedScore           float64 `json:"verifiedScore"`
	ScheduledVisitationDate *string `gorm:"type:varchar(32)" json:"scheduledVisitationDate,omitempty"`

	// Relational components
	BosBudget       BosBudgetData   `gorm:"embedded;embeddedPrefix:bos_" json:"bosBudget"`
	AiRiskLevel     AiRiskLevel     `gorm:"type:varchar(32);not null" json:"aiRiskLevel"`
	AiAssessorBrief AiAssessorBrief `gorm:"embedded;embeddedPrefix:ai_" json:"aiAssessorBrief"`

	StageDetails   []AccreditationStageItem `gorm:"foreignKey:SchoolID;constraint:OnDelete:CASCADE" json:"stageDetails"`
	RadarStandards []RadarStandardItem      `gorm:"foreignKey:SchoolID;constraint:OnDelete:CASCADE" json:"radarStandards"`
	CitizenReports []CitizenReportItem      `gorm:"foreignKey:SchoolID;constraint:OnDelete:CASCADE" json:"citizenReports"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type BosAllocations struct {
	Sarpras      int64 `json:"sarpras" gorm:"column:alloc_sarpras"`
	Operasional  int64 `json:"operasional" gorm:"column:alloc_operasional"`
	GuruHonor    int64 `json:"guruHonor" gorm:"column:alloc_guru_honor"`
	Digitalisasi int64 `json:"digitalisasi" gorm:"column:alloc_digitalisasi"`
}

type BosBudgetData struct {
	TotalReceived       int64          `json:"totalReceived"`
	Absorbed            int64          `json:"absorbed"`
	AbsorptionRate      float64        `json:"absorptionRate"`
	ReportedAllocations BosAllocations `gorm:"embedded" json:"reportedAllocations"`
}

type AiAssessorBrief struct {
	Summary         string  `gorm:"type:text" json:"summary"`
	DiscrepancyRate float64 `json:"discrepancyRate"`
	RiskBadge       string  `gorm:"type:varchar(64)" json:"riskBadge"`
	MandatoryFocus1 string  `gorm:"type:text" json:"-"`
	MandatoryFocus2 string  `gorm:"type:text" json:"-"`
	MandatoryFocus3 string  `gorm:"type:text" json:"-"`
	FlagsString     string  `gorm:"type:text" json:"-"`
	GeneratedAt     string  `gorm:"type:varchar(64)" json:"generatedAt"`

	// Dynamic slices mapped for JSON response
	MandatoryInvestigationFocus []string `gorm:"-" json:"mandatoryInvestigationFocus"`
	Flags                       []string `gorm:"-" json:"flags"`
}

type AccreditationStageItem struct {
	ID                 uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	SchoolID           string  `gorm:"type:varchar(64);index;not null" json:"schoolId"`
	StageNumber        int     `json:"stageNumber"`
	Name               string  `gorm:"type:varchar(128);not null" json:"name"`
	Status             string  `gorm:"type:varchar(32);not null" json:"status"` // completed, in_progress, pending, overdue
	DaysSpent          int     `json:"daysSpent"`
	MaxSlaDays         int     `json:"maxSlaDays"`
	StartedAt          *string `gorm:"type:varchar(32)" json:"startedAt,omitempty"`
	CompletedAt        *string `gorm:"type:varchar(32)" json:"completedAt,omitempty"`
	ResponsibleOfficer *string `gorm:"type:varchar(128)" json:"responsibleOfficer,omitempty"`
	Notes              *string `gorm:"type:text" json:"notes,omitempty"`
}

type RadarStandardItem struct {
	ID            uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	SchoolID      string  `gorm:"type:varchar(64);index;not null" json:"schoolId"`
	Subject       string  `gorm:"type:varchar(128);not null" json:"subject"`
	ClaimedScore  float64 `json:"claimedScore"`
	VerifiedScore float64 `json:"verifiedScore"`
	FullMark      float64 `gorm:"default:100" json:"fullMark"`
}

type OfficialSchoolResponse struct {
	ResponderName string `gorm:"type:varchar(128)" json:"responderName"`
	ResponderRole string `gorm:"type:varchar(128)" json:"responderRole"`
	Text          string `gorm:"type:text" json:"text"`
	RespondedAt   string `gorm:"type:varchar(64)" json:"respondedAt"`
}

type CitizenReportItem struct {
	ID               string                  `gorm:"primaryKey;type:varchar(64)" json:"id"`
	SchoolID         string                  `gorm:"type:varchar(64);index;not null" json:"schoolId"`
	Author           string                  `gorm:"type:varchar(128);not null" json:"author"`
	AuthorRole       string                  `gorm:"type:varchar(64);not null" json:"authorRole"`
	Date             string                  `gorm:"type:varchar(32);not null" json:"date"`
	FacilityTag      string                  `gorm:"type:varchar(64);not null" json:"facilityTag"`
	Text             string                  `gorm:"type:text;not null" json:"text"`
	PhotoURL         string                  `gorm:"type:text" json:"photoUrl,omitempty"`
	Upvotes          int                     `gorm:"default:1" json:"upvotes"`
	Status           string                  `gorm:"type:varchar(32);default:'investigating'" json:"status"` // verified, investigating, countered
	VerifiedBy       string                  `gorm:"type:varchar(128)" json:"verifiedBy,omitempty"`
	VerifiedAt       string                  `gorm:"type:varchar(64)" json:"verifiedAt,omitempty"`
	FollowUpStatus   string                  `gorm:"type:varchar(32);default:'waiting_response'" json:"followUpStatus,omitempty"`
	OfficialResponse *OfficialSchoolResponse `gorm:"embedded;embeddedPrefix:resp_" json:"officialResponse,omitempty"`
	CreatedAt        time.Time               `json:"createdAt"`
}

type TransparencyStats struct {
	TotalSchoolsTracked      int     `json:"totalSchoolsTracked"`
	OverduePercentage        float64 `json:"overduePercentage"`
	OverdueCount             int     `json:"overdueCount"`
	TotalCitizenReports      int     `json:"totalCitizenReports"`
	VerifiedReports          int     `json:"verifiedReports"`
	AvgAbsorptionRate        float64 `json:"avgAbsorptionRate"`
	HighDiscrepancyCount     int     `json:"highDiscrepancyCount"`
	UpcomingVisitationsCount int     `json:"upcomingVisitationsCount"`
}

type AuthUser struct {
	ID        string `json:"id"`
	NIP       string `json:"nip"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	RoleLabel string `json:"roleLabel"`
	Region    string `json:"region"`
	Token     string `json:"token"`
}
