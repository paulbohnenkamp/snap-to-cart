import { Stack } from 'expo-router'; import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; import { useEffect } from 'react'; import { useSession } from '@/store/session';
const qc=new QueryClient();
export default function Root(){const hydrate=useSession(s=>s.hydrate);useEffect(()=>{hydrate()},[hydrate]);return <QueryClientProvider client={qc}><Stack screenOptions={{headerShown:false}}/></QueryClientProvider>}
