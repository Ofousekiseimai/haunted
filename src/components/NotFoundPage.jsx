// Add this before your App component or in a new file
const NotFoundPage = () => (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Δεν βρέθηκε</h1>
      <p className="text-gray-600 mb-4">Η σελίδα που ζητήσατε δεν υπάρχει</p>
      <Link to="/" className="text-blue-600 underline">
        Επιστροφή στην αρχική
      </Link>
    </div>
  );

  export default NotFoundPage;