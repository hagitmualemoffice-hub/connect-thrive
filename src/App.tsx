import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index.tsx";
import IndexV1 from "./pages/IndexV1.tsx";
import IndexV2 from "./pages/IndexV2.tsx";
import Lectures from "./pages/Lectures.tsx";
import Workshops from "./pages/Workshops.tsx";
import Projects from "./pages/Projects.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Podcast from "./pages/Podcast.tsx";
import ApiTester from "./pages/ApiTester.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop";
import V2Link from "./components/V2Link";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBlogList from "./pages/admin/BlogList";
import AdminBlogEdit from "./pages/admin/BlogEdit";
import AdminLecturesList from "./pages/admin/LecturesList";
import AdminPodcastList from "./pages/admin/PodcastList";
import AdminProjectsList from "./pages/admin/ProjectsList";
import AdminLeads from "./pages/admin/Leads";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <V2Link />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/v1" element={<IndexV1 />} />
            <Route path="/v2" element={<IndexV2 />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/api-tester" element={<ApiTester />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<AdminBlogList />} />
              <Route path="blog/:id" element={<AdminBlogEdit />} />
              <Route path="lectures" element={<AdminLecturesList />} />
              <Route path="podcast" element={<AdminPodcastList />} />
              <Route path="projects" element={<AdminProjectsList />} />
              <Route path="leads" element={<AdminLeads />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
