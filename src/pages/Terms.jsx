// pages/Terms.jsx
import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Helmet>
        <title>Haunted.gr - Όροι Χρήσης</title>
        <meta
          name="description"
          content="Διαβάστε τους όρους χρήσης και τις προϋποθέσεις του Haunted.gr"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">
          Όροι Χρήσης & Προϋποθέσεις
        </h1>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Πνευματικά Δικαιώματα</h2>
            <p className="leading-relaxed text-gray-300">
              Όλο το περιεχόμενο του Haunted.gr (άρθρα, εικόνες, γραφικά, χάρτες, διαδραστικά στοιχεία, κείμενα) προστατεύεται από την ελληνική και διεθνή νομοθεσία περί πνευματικής ιδιοκτησίας. Η αντιγραφή, αναδημοσίευση, διανομή ή τροποποίηση χωρίς προηγούμενη έγγραφη άδεια απαγορεύεται αυστηρά.
              <br /><br />
              Εξαίρεση αποτελούν τα αποσπάσματα που αναφέρονται σε πηγές, τα οποία παρατίθενται με σεβασμό στους δημιουργούς και όπου είναι δυνατόν, παραπέμπουν σε σύνδεσμο αγοράς των πρωτότυπων έργων.
            </p>
          </div>

          {/* Section 2 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Αποποίηση Ευθύνης</h2>
            <p className="leading-relaxed text-gray-300">
              Το περιεχόμενο του Haunted.gr βασίζεται σε ιστορικές πηγές, λαογραφικές καταγραφές, δημοσιευμένα βιβλία και εφημερίδες, καθώς και μαρτυρίες του παρελθόντος. Δεν φέρουμε καμία ευθύνη για την ακρίβεια ή την απόλυτη τεκμηρίωση των πληροφοριών, καθώς μεγάλο μέρος αφορά παραδόσεις, προφορικές αφηγήσεις και μη αποδείξιμα φαινόμενα.
              <br /><br />
              Το Haunted.gr δεν προωθεί ή ενθαρρύνει την πίστη σε μεταφυσικά φαινόμενα, ούτε την υιοθέτηση επικίνδυνων συμπεριφορών που σχετίζονται με αυτά. Η χρήση της πληροφορίας γίνεται αποκλειστικά με ευθύνη του επισκέπτη.
            </p>
          </div>

          {/* Section 3 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Πολιτική για τις Τοποθεσίες του Χάρτη</h2>
            <p className="leading-relaxed text-gray-300">
              Ο «Μεταφυσικός Χάρτης» της Ελλάδας αποτελεί καλλιτεχνική και λαογραφική απεικόνιση των περιοχών που σχετίζονται με τοπικές παραδόσεις, θρύλους, ιστορίες ή μαρτυρίες μεταφυσικού χαρακτήρα. Δεν πρόκειται για οδηγό επίσκεψης ή σύσταση μετακίνησης σε συγκεκριμένα μέρη.
              <br /><br />
              Το Haunted.gr δεν φέρει καμία ευθύνη για οποιοδήποτε ατύχημα, παραβίαση ή πρόβλημα προκύψει από την επίσκεψη σε τοποθεσίες που αναφέρονται στον χάρτη. Η χρήση του χάρτη γίνεται με αποκλειστική ευθύνη του χρήστη.
            </p>
          </div>

          {/* Section 4 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Υποβολή Περιεχομένου από Χρήστες (μόνο για mobile app)</h2>
            <p className="leading-relaxed text-gray-300">
              Η δυνατότητα αποστολής προσωπικών εμπειριών ή ιστοριών από χρήστες θα είναι διαθέσιμη μέσω του επερχόμενου mobile app. Το Haunted.gr διατηρεί το δικαίωμα να εξετάζει, τροποποιεί ή απορρίπτει οποιοδήποτε περιεχόμενο κριθεί:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Ανακριβές</li>
              <li>Παραπλανητικό</li>
              <li>Μη συμβατό με τους σκοπούς της πλατφόρμας</li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-300">
              Η αποστολή περιεχομένου ισοδυναμεί με παραχώρηση άδειας χρήσης και δημοσίευσης στο Haunted.gr, χωρίς οικονομική ή άλλη απαίτηση εκ μέρους του αποστολέα.
            </p>
          </div>

          {/* Section 5 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Περιορισμός Πρόσβασης</h2>
            <p className="leading-relaxed text-gray-300">
              Το Haunted.gr διατηρεί το δικαίωμα να αναστείλει προσωρινά ή μόνιμα την πρόσβαση χρηστών που:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
              <li>Παραβιάζουν τους όρους χρήσης</li>
              <li>Χρησιμοποιούν καταχρηστικά τις υπηρεσίες</li>
              <li>Επιχειρούν να υπονομεύσουν την ομαλή λειτουργία της πλατφόρμας</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="pb-8 border-b border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Τροποποιήσεις Όρων</h2>
            <p className="leading-relaxed text-gray-300">
              Το Haunted.gr διατηρεί το δικαίωμα να τροποποιεί οποιονδήποτε από τους παραπάνω όρους χωρίς προηγούμενη ειδοποίηση. Συνιστούμε την τακτική ανασκόπηση αυτής της σελίδας. Η συνέχιση χρήσης της ιστοσελίδας μετά από αλλαγές στους όρους συνεπάγεται την αποδοχή τους.
            </p>
          </div>

          {/* Section 7 */}
          <div className="pb-8">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Επικοινωνία</h2>
            <p className="leading-relaxed text-gray-300">
              Για οποιαδήποτε απορία, παρατήρηση ή αίτημα σχετικά με τους Όρους Χρήσης, μπορείτε να επικοινωνήσετε μαζί μας στο:
            </p>
            <div className="mt-6 p-4 bg-gray-800 rounded-lg text-center">
              <a
                href="mailto:info@haunted.gr"
                className="text-purple-400 hover:text-purple-300 transition-colors text-lg"
              >
                📧 info@haunted.gr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;