import StarSignsPage from "./pages/StarSignsPage.tsx";
import Result from './pages/Result.tsx';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './App.css'
import AdminPage from "./pages/AdminPage.tsx";

function App() {
    return (
        <RouterProvider
            router={
                createBrowserRouter([
                    {
                        path: "/",
                        element: <StarSignsPage />,
                    },
                    {
                        path: "/result",
                        element: <Result />,
                    },
                    {
                        path: "/admin",
                        element: <AdminPage />,
                    },
                ])
            }
        />
    )
}

export default App
