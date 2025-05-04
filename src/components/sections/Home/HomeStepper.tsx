export default function HomeStepper() {
    const steps = [
      {
        title: "Soumission de la Demande",
        description:
          "L'employé soumet un formulaire de demande d'avance précisant le montant souhaité et la raison.",
      },
      {
        title: "Validation du Supérieur",
        description:
          "Le responsable hiérarchique examine et approuve ou rejette la demande.",
      },
      {
        title: "Vérification RH et Comptabilité",
        description:
          "Le service RH vérifie la conformité de la demande et consulte la comptabilité.",
      },
      {
        title: "Versement de l'Avance",
        description:
          "Après approbation finale, l'avance est versée sur le compte bancaire de l'employé.",
      },
    ];
  
    return (
      <section className="w-full px-6 py-16 mx-auto lg:px-28">
        <div className="container">
            <div className='section-heading'>
                <div className='flex justify-center'>
                    <div className='tag'>Etapes</div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <h2 className="section-title">Comment ça marche ?</h2>
                    <div className="mt-2">
                        <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
                        <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                        <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                    </div>
                </div>
                <p className='section-description mt-5'>
                    Accédez facilement à une avance sur salaire grâce à notre 
                    processus simplifié. En seulement quatre étapes claires, vous 
                    pouvez soumettre votre demande, obtenir l&apos;approbation nécessaire 
                    et recevoir votre avance directement sur votre compte.   
                </p> 
            </div>
        </div>
  
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col p-6 space-y-4 text-center bg-white rounded-2xl shadow-md dark:bg-gray-800 transition-transform hover:scale-105"
            >
              <div className="mx-auto flex items-center justify-center w-12 h-12 text-white bg-[#10059F] rounded-full text-lg font-semibold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  