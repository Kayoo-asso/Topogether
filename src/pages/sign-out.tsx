import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const auth = useAuth();
  auth.signOut();
  
  return null;
}