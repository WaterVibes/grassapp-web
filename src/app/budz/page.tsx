import { BuddyApp } from '../../Budz/pages/BuddyApp';

export default function BudzPage() {
  return (
    <main className="min-h-screen bg-black">
      <BuddyApp />
    </main>
  );
}

// Add metadata for the page
export const metadata = {
  title: 'GrassApp Budz - Driver Portal',
  description: 'GrassApp delivery driver portal for managing deliveries and earnings',
}; 