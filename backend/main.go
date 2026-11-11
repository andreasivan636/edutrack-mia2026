package main

import (
	"log"
	"os"

	"edu-track-backend/database"
	"edu-track-backend/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load Environment Variables from .env if present
	if err := godotenv.Load(); err != nil {
		log.Println("[INFO] No .env file found, using system environment variables / local persistent store.")
	}

	// 2. Initialize Database Connection (Supabase PostgreSQL with automatic Local JSON/In-Memory fallback)
	_, _ = database.InitDB()

	// 3. Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName:      "Edu Track API — Transparent School Assessment Tracking",
		ServerHeader: "EduTrack-Fiber/v2",
	})

	// 4. Middlewares
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path} (${latency})\n",
	}))
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: false,
	}))

	// 5. Health Check & Root Route
	storageMode := "local_persistent_store (data/local_store.json)"
	if database.DB != nil {
		storageMode = "supabase_postgresql"
	}

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"project":     "Edu Track — Transparent School Assessment Tracking & Public Audit Dashboard",
			"competition": "MIA 2026 (WIA)",
			"theme":       "Designing Digital Futures - Powering Public Transparency",
			"status":      "online",
			"storageMode": storageMode,
			"version":     "1.2.0",
			"endpoints": []string{
				"POST /api/auth/login",
				"GET /api/schools",
				"GET /api/schools/:id",
				"POST /api/schools",
				"PUT /api/schools/:id/sla",
				"POST /api/schools/:id/reports",
				"PUT /api/reports/:id/verify",
				"GET /api/stats",
			},
		})
	})

	// 6. API Group Routes
	api := app.Group("/api")
	api.Post("/auth/login", handlers.LoginAssessorAdmin)
	api.Get("/schools", handlers.GetSchools)
	api.Get("/schools/:id", handlers.GetSchoolByID)
	api.Post("/schools", handlers.CreateSchool)
	api.Put("/schools/:id/sla", handlers.UpdateSchoolSLA)
	api.Post("/schools/:id/reports", handlers.CreateCitizenReport)
	api.Put("/reports/:id/verify", handlers.VerifyCitizenReport)
	api.Put("/reports/:id/response", handlers.SubmitOfficialResponse)
	api.Get("/stats", handlers.GetTransparencyStats)

	// 7. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[INFO] Edu Track backend server listening on port :%s (storage: %s)\n", port, storageMode)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("[FATAL] Fiber server failed to start: %v\n", err)
	}
}
