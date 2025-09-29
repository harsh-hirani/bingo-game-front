import { AuthForm } from "@/components/auth/auth-form"
import { MainNav } from "@/components/navigation/main-nav"

export default function CreatorLoginPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <AuthForm type="login" userType="creator" />
    </div>
  )
}
