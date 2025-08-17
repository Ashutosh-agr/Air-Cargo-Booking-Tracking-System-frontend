Air Cargo Booking & Tracking
High Level Design (HLD):
1. Introduction:
The Air Cargo Booking & Tracking System is designed to streamline the process of booking and monitoring air cargo shipments. It enables users to create bookings, search for available flights, and track the status of shipments through a timeline of events. The system also enforces key business rules such as one-stop transit limits and same-day/next-day connection constraints.
2. Purpose of the System:
The purpose of the Air Cargo Booking & Tracking System is to provide a centralized, efficient, and user-friendly platform for managing air cargo operations. The system enables customers and operators to:
•	Book cargo shipments by creating bookings with essential shipment details such as origin, destination, pieces, and weight.
•	Search for available flight routes (direct and one-stop) based on origin, destination, and departure date.
•	Track shipment status in real time through a timeline of events (Booked, Departed, Arrived, Cancelled).
•	Ensure operational efficiency by enforcing business rules such as flight connections being restricted to the same day or next day.
•	Improve visibility and transparency for customers and administrators by maintaining detailed booking history and event logs.
The system is designed to be scalable, reliable, and responsive, offering seamless integration between backend services (Spring Boot + PostgreSQL), frontend UI (Next.js), and supporting services like logging, monitoring, and caching for performance optimization.
3. Architecture Overview:
     System Type: Microservice (Spring Boot) application for air cargo booking and tracking.
      Core Components:  
API Layer: REST controllers for flight search and booking management.
Service Layer: Business logic for booking, flight routing, and event handling.
Persistence Layer:
PostgreSQL: Stores bookings, flights, and event timelines.
Redis: Used for distributed caching and distributed locking (via Radisson).
Distributed Locking: Ensures concurrency safety for booking operations.
Event Timeline: Tracks booking status changes and events.
Fig 1: System Architecture – Next.js Frontend with Spring Boot Backend, PostgreSQL Database, and Redis Cache
4. UI Section
The portal is built with Next.js (React) and styled for simplicity using Tailwind CSS.
Features:
o	Booking Form: Enter origin, destination, and cargo details to create a new booking.
o	Flight Search: Search for direct and one-stop flights between airports.
o	Booking Details Page: Track cargo status with a chronological timeline of events and a visual journey line.
o	Design Goal: Minimalist, responsive UI with clear data visualization for non-technical users. The layout adapts to all screen sizes, with intuitive navigation and accessible controls.
Fig 2: Booking Portal

						Fig 2.1: Tracking Portal
Fig 2.2: Flight Portal
5. Modules and Responsibilities:
Flight Management: Responsible for storing flight schedules and enabling efficient search for direct and connecting flights based on origin, destination, and departure date.  
Booking Management: Handles creation, updating, and status transitions (booked, departed, arrived, cancelled) of bookings. Ensures data consistency and concurrency control. 
Tracking & Timeline: Maintains a chronological event history for each booking, recording all status changes and key actions. Supports retrieval of booking history for tracking purposes. 
UI: Provides user interfaces for booking creation, flight search, and real-time tracking. Enables users to interact with the system through forms and tracking panels.
6. Database Design:
Flight: Stores flight details (flight number, origin, destination, date, etc.).
Booking: Stores booking info (ref_id, origin, destination, status, etc.).
BookingEvents: Stores chronological events for each booking (event type, location, timestamp, etc.).

7. API Endpoints:
Flight Management  
GET /flights/routes — Search available flights
POST /flights — Add a new flight
Booking Management  
POST /bookings — Create a new booking
PATCH /bookings/{refId}/depart — Mark booking as departed (with flight number)
PATCH /bookings/{refId}/arrive — Mark booking as arrived (with flight number)
PATCH /bookings/{refId}/cancel — Cancel a booking
Tracking & Timeline  
GET /bookings/{refId} — Get booking event timeline/history
8. Non – Functional Consideration:
Database Indexing: Create a composite index on (origin, departure_time) in the Flight table to optimize search queries for flights by origin and departure time.
Caching: Implement caching (e.g., using Redis) for popular flight search results to reduce database load and improve response times.
Monitoring: Enable application logging and expose metrics (e.g., via Spring Boot Actuator) to monitor system health, track errors, and analyse performance.
Low Level Design (LLD):
1.Database Schema:
flight  
o	id (UUID, PK)
o	flight_number (VARCHAR, unique)
o	airline_name(VARCHAR)
o	origin (VARCHAR)
o	destination (VARCHAR)
o	departure_time (TIMESTAMP)
o	arrival_time (TIMESTAMP)
booking  
o	id (UUID, PK)
o	ref_id (VARCHAR, unique)
o	origin (VARCHAR)
o	destination (VARCHAR)
o	pieces (INTEGER)
o	weight_kg (INTEGER)
o	status (VARCHAR)
o	created_at (TIMESTAMP)
o	updated_at (TIMESTAMP)
booking_event
o	id (UUID, PK)
o	booking_id (UUID, FK → booking.id)
o	event_type (VARCHAR)
o	location (VARCHAR)
o	timestamp (TIMESTAMP)
o	flight_id (UUID, FK → flight.id, nullable)
Fig 3: System Database Schema Structure
2. Detailed API Contracts:
Search Available Flights
GET /flight/routes?origin=DEL&destination=HYD&departureDate=2025-08-15
Response
  {
    "direct": [
        {
            "id": "1953ba48-42bd-4d3e-9a91-58def5272928",
            "flightNumber": "AI202",
            "airlineName": "Air India",
            "departureTime": "2025-08-15T03:30:00Z",
            "arrivalTime": "2025-08-15T05:30:00Z",
            "origin": "DEL",
            "destination": "HYD"
        }
    ],
    "oneStop": [
        {
            "firstLeg": {
                "id": "2181b851-ba1a-4e61-8b12-cba986435fff",
                "flightNumber": "AI369",
                "airlineName": "Air India",
                "departureTime": "2025-08-15T03:30:00Z",
                "arrivalTime": "2025-08-15T05:30:00Z",
                "origin": "DEL",
                "destination": "BLR"
            },
            "secondLeg": {
                "id": "016e1053-3e4f-4cef-9499-e42ccd0dcb22",
                "flightNumber": "AI209",
                "airlineName": "Air India",
                "departureTime": "2025-08-16T03:30:00Z",
                "arrivalTime": "2025-08-16T05:30:00Z",
                "origin": "BLR",
                "destination": "HYD"
            }
        }
    ]
}

Add New Flight
POST /flights
Request
{
  "flightNumber": "AI102",
  “airlineName”: “Air India”,
  "origin": "DEL",
  "destination": "BLR",
  "departureTime": "2024-07-02T10:00:00+05:30",
  "arrivalTime": "2024-07-02T13:00:00+05:30"
}
Response
{
  "id": "c2b3a4d5-e6f7-8901-bcda-2345678901fa",
  "flightNumber": "AI102",
  “airlineName”: “Air India”,
  "origin": "DEL",
  "destination": "BLR",
  "departureTime": "2024-07-02T10:00:00",
  "arrivalTime": "2024-07-02T13:00:00"
}
Create A New Booking
POST /bookings
Request
{
    "refId": "44B",
    "origin": "DEL",
    "destination": "HYD",
    "pieces": 32,
    "weightKg": 32
}

Response
{
    "id": "205ce77b-93f2-46c7-848b-1d60b271f341",
    "refId": "44B",
    "origin": "DEL",
    "destination": "HYD",
    "pieces": 32,
    "weightKg": 32,
    "status": "BOOKED",
    "createdAt": "2025-08-17T06:53:06.5788578",
    "updatedAt": "2025-08-17T06:53:06.5788578",
    "version": 0
}
Mark Bookings
As Depart
PATCH /bookings/44B/depart?flightNumber=AI369
As arrive
PATCH /bookings/44B/arrive?flightNumber=AI369
As cancel 
PATCH /bookings/44B/cancel
3. Sequence Diagram:
Create Booking:
Fig 4: Create Booking Flow
Search Available Flights
	Fig 5: Search Available Flight Flow
Depart Booking 
Fig 6: Depart Cargo Flow
Retrieve Booking History
Fig 7: Retrieve Booking History Flow
Booking Status Change
Fig 8: Booking Status Change Flow
4. Performance Considerations:
•	Why findSecondLeg uses between arrivalDate and arrivalDate+1: 
This query pattern allows the system to find connecting flights that arrive either on the same day or the next day, accommodating overnight layovers. It increases the chance of finding valid connections for multi-leg journeys, improving user experience and booking flexibility.
•	Why indexes are added: 
Indexes are created on frequently queried columns (like refId, flightNumber, or date fields) to speed up search and retrieval. Without indexes, the database must scan the entire table for each query, which is slow for large datasets. Indexes allow the database to quickly locate relevant rows, reducing query latency and improving throughput.
•	Why caching is used: 
Caching is used to store frequently accessed data (like flight schedules or booking details) in memory, reducing repeated database queries. This improves response times and reduces database load, especially for read-heavy or rarely changing data.  In this project, a distributed cache (such as Redis) is typically used, often integrated via Spring Cache abstraction. Distributed caching is chosen because:  
o	It allows multiple application instances to share cached data, ensuring consistency and scalability in clustered or microservices environments.
o	Redis provides fast, in-memory access and supports features like TTL (time-to-live) and eviction policies.
o	It helps maintain high availability and performance even as the system scales horizontally.

This approach ensures that all nodes in the system benefit from the cache, not just a single instance, making it suitable for cloud-native and scalable architectures. Why version optimistic locking is used: Optimistic locking (using a @Version field) ensures data consistency during concurrent updates. Each update checks the version; if another transaction has modified the record, the update fails. This prevents lost updates without locking the row, making it efficient for low-contention scenarios and improving overall throughput.
•	Why distributed locking with Redisson is used: 
Distributed locking is necessary when multiple application instances (e.g., in a microservices or clustered environment) might update the same resource concurrently. Redisson uses Redis to coordinate locks across instances, ensuring only one process can modify a resource at a time, preventing race conditions and data corruption.
•	Why in booking optimistic is used (@Version) instead of distributed: 
Optimistic locking is lightweight and sufficient when updates are infrequent or contention is low, and when all updates happen within a single database instance. It avoids the overhead of distributed coordination, making it more efficient for simple, local concurrency control.
•	Why in BookingService distributed lock is used instead of optimistic: 
Distributed locks are used in BookingService for operations that must be synchronized across multiple nodes (e.g., in a cloud or clustered deployment). Optimistic locking only works within a single database transaction, but distributed locks ensure that only one instance across the whole system can process a critical section at a time, providing stronger consistency guarantees in distributed environments.
•	Why HikariCP is used:
HikariCP is used as the connection pool for your data source because it is the default and recommended JDBC connection pool in Spring Boot. It is chosen for its high performance, low latency, and efficient resource management. HikariCP helps manage database connections efficiently, reducing overhead and improving the scalability and responsiveness of your application, especially under high load.

