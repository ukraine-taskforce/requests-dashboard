import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "react-query";

import "./index.css";
import "./others/contexts/i18n";
import reportWebVitals from "./reportWebVitals";

import { AuthWrapper } from "./others/components/AuthWrapper";
import { queryClient } from "./others/contexts/api";
import { Login } from "./pages/login";
import { Requests } from "./pages/requests";
import { Incidents } from "./pages/incidents";
import { NotFound } from "./pages/notFound";

// ReactDOM.render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <Routes>
//           <Route element={<AuthWrapper />}>
//             <Route path="/" element={<Login />} />
//             <Route path="/locator" element={<Requests />} />
//             <Route path="/people" element={<Incidents />} />
//             <Route path="*" element={<NotFound />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </QueryClientProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );


ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthWrapper />}>
            <Route path="/" element={<Login />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
