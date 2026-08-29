import { UserCircle } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function ProfilePage() {
  return (
    <PagePlaceholder
      icon={UserCircle}
      title="Profile"
      description="Dr. Ananya Rao · Medical Officer"
      points={[
        "Worker credentials",
        "Verification & role",
        "Notification settings",
        "Session & security",
      ]}
    />
  )
}
