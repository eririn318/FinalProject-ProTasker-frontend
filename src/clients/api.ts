import axios from "axios";

export const apiClient = axios.create({

    baseURL:  import.meta.env.VITE_BACKEND_URL,
    // baseURL: 'http://localhost:4000',
    headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5MzBiOTU1OWY4OTM5MTRhZTVlNTYxYyIsInVzZXJuYW1lIjoiZXJpa28iLCJlbWFpbCI6ImVyaWtvQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTc2NTM4ODUwNywiZXhwIjoxNzY1NDc0OTA3fQ.AWa8FEhNwPlSzsSecOxkTg7cBH72FbQUZDwF-Lg9VmQ"
    }
})