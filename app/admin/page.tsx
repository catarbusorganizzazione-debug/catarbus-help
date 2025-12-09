import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        ADMIN
      </main>
      
      <Footer />
    </div>
  );
}
