// pages/Privacy.jsx
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Helmet>
        <title>Haunted.gr - Πολιτική Απορρήτου</title>
        <meta
          name="description"
          content="Διαβάστε την πολιτική απορρήτου και προστασίας δεδομένων του Haunted.gr"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">
          Πολιτική Απορρήτου
        </h1>

        <div className="space-y-8">
          {/* Introduction */}
          <div className="pb-8 border-b border-gray-700">
            <p className="leading-relaxed text-gray-300">
              Η προστασία των προσωπικών σας δεδομένων είναι εξαιρετικά σημαντική για εμάς. Στο Haunted.gr δεσμευόμαστε να διασφαλίζουμε ότι κάθε πληροφορία που συλλέγεται μέσω της ιστοσελίδας ή των εφαρμογών μας χρησιμοποιείται με υπευθυνότητα, διαφάνεια και με σεβασμό προς την ιδιωτικότητά σας.
            </p>
          </div>

          {/* Section 1 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Τι Δεδομένα Συλλέγουμε</h2>
            <p className="leading-relaxed text-gray-300">
              Κατά την επίσκεψή σας στην ιστοσελίδα ή τη χρήση της mobile εφαρμογής μας, ενδέχεται να συλλέγονται:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Διεύθυνση IP</li>
              <li>Πληροφορίες συσκευής & browser</li>
              <li>Cookies & παρόμοιες τεχνολογίες</li>
              <li>Τοποθεσία (μόνο με ρητή άδεια)</li>
              <li>Φόρμες υποβολής εμπειριών ή επαφής</li>
              <li>Ανώνυμα στατιστικά χρήσης</li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-300">
              Δεν συλλέγουμε ποτέ δεδομένα ευαίσθητου χαρακτήρα όπως τραπεζικές πληροφορίες, αριθμούς ταυτότητας ή υγειονομικά στοιχεία.
            </p>
          </div>

          {/* Section 2 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Χρήση Δεδομένων</h2>
            <p className="leading-relaxed text-gray-300">
              Τα δεδομένα που συλλέγουμε χρησιμοποιούνται αποκλειστικά για:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Ανάλυση επισκεψιμότητας</li>
              <li>Βελτιστοποίηση εμπειρίας χρήστη</li>
              <li>Λειτουργία βασικών χαρακτηριστικών</li>
              <li>Διαχείριση υποβολών περιεχομένου</li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-300">
              Δεν πουλάμε, ενοικιάζουμε ή μεταβιβάζουμε δεδομένα σε τρίτους.
            </p>
          </div>

          {/* Section 3 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Cookies</h2>
            <p className="leading-relaxed text-gray-300">
              Χρησιμοποιούμε cookies για:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Λειτουργικότητα του site</li>
              <li>Ανάλυση (Google Analytics)</li>
              <li>Γεωεντοπισμό (με άδεια)</li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-300">
              Μπορείτε να ρυθμίσετε το browser σας να απορρίπτει cookies.
            </p>
          </div>

          {/* Section 4 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Τοποθεσία Χρήστη</h2>
            <p className="leading-relaxed text-gray-300">
              Η εφαρμογή ζητά πρόσβαση στην τοποθεσία σας <span className="font-semibold">μόνο με ρητή άδεια</span>. Τα δεδομένα τοποθεσίας:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Χρησιμοποιούνται τοπικά στη συσκευή</li>
              <li>Δεν αποθηκεύονται στους servers μας</li>
              <li>Δεν κοινοποιούνται σε τρίτους</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Υποβολή Περιεχομένου</h2>
            <p className="leading-relaxed text-gray-300">
              Όταν υποβάλλετε περιεχόμενο:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Χρησιμοποιούμε μόνο τα απαραίτητα δεδομένα</li>
              <li>Διατηρούμε δικαίωμα δημοσίευσης</li>
              <li>Προστατεύουμε τα προσωπικά σας στοιχεία</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Αποθήκευση & Ασφάλεια</h2>
            <p className="leading-relaxed text-gray-300">
              Χρησιμοποιούμε:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Ασφαλείς servers</li>
              <li>Σύγχρονη κρυπτογράφηση</li>
              <li>Firewall προστασία</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Δικαιώματα Χρηστών</h2>
            <p className="leading-relaxed text-gray-300">
              Έχετε δικαίωμα να:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Προβάλετε τα δεδομένα σας</li>
              <li>Ενημερώσετε/Διορθώσετε</li>
              <li>Διαγράψετε</li>
            </ul>
            
          </div>

          {/* Section 8 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">8. Τρίτοι Πάροχοι</h2>
            <p className="leading-relaxed text-gray-300">
              Χρησιμοποιούμε υπηρεσίες όπως:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Google Analytics</li>
              <li>Cloudflare</li>
              <li>Vercel</li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-300">
              Κάθε πάροχος έχει τη δική του πολιτική απορρήτου.
            </p>
          </div>

          {/* Section 9 */}
          <div className="pb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">9. Αλλαγές στην Πολιτική</h2>
            <p className="leading-relaxed text-gray-300">
              Διατηρούμε το δικαίωμα τροποποιήσεων. Τελευταία ενημέρωση:
            </p>
            <p className="mt-4 text-center text-gray-400">
              Μάιος 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;