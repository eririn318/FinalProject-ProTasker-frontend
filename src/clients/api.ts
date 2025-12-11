import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // baseURL: 'http://localhost:4000',
  headers: {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5MzBiOTU1OWY4OTM5MTRhZTVlNTYxYyIsInVzZXJuYW1lIjoiZXJpa28iLCJlbWFpbCI6ImVyaWtvQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTc2NTQ3ODczOSwiZXhwIjoxNzY1NTY1MTM5fQ.dj9udM-5IKLPTyssCXS0ynLbO5miU7Qo9VDii_6nRwA",
  },
});

// import axios from "axios";
// export const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   // headers: {
//   //   Authorization:
//   //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5MzcxOGIwMGRlZmRhNzZmM2U1MTAzMCIsInVzZXJuYW1lIjoidXNlcjAwMCIsImVtYWlsIjoidXNlcjAwMEB0ZXN0LmNvbSIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTc2NTIyMDIwOSwiZXhwIjoxNzY1MzA2NjA5fQ.9MMz-9emIkBtD-gRgHyo4P9BwZqoxTU1yufOiUUvo3s",
//   // },
// });
// //I need to inject token dynamically after login so i need to add interceptor to attach token automatically
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
