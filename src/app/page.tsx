"use client";
import { Button, Loader, Stepper } from "@mantine/core";
import { IconChevronLeft, IconPlayerPlay, IconSend } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/legacy/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./components/logo";
import StepperIndicator from "./components/stepper";
import decades from "./data/players.json";

export default function Home() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [activeStep, setActiveStep] = useState(0);
  const [isGoingForward, setIsGoingForward] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/token/${token}`, {
      method: "GET",
    })
      .then((res) => res.status)
      .then((data) => {
        if (data === 500) {
          setStatus("error");
        } else if (data === 200) {
          setStatus("alreadyAnswered");
        } else {
          setStatus("unknown");
        }
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, [token]);

  const scrollToTop = () =>
    setTimeout(() => {
      const top = document.getElementById("top");
      top?.scrollIntoView({ behavior: "smooth" });
    }, 500);

  const handleSelectPlayer = (decade: number, playerName: string) => {
    setSelectedPlayers((prev) => ({ ...prev, [decade]: playerName }));
    setIsGoingForward(true);
    setTimeout(() => {
      setActiveStep((prev) => prev + 1);
      scrollToTop();
    }, 500);
  };

  const handleSubmit = () => {
    console.log(
      JSON.stringify({ players: Object.values(selectedPlayers) }, null, 2)
    );
    setStatus("success");
  };

  const BackButton = () => {
    return (
      <Button
        size="lg"
        variant="transparent"
        leftSection={<IconChevronLeft size={20} />}
        onClick={() => {
          setIsGoingForward(false);
          setTimeout(() => setActiveStep(activeStep - 1), 100);
          scrollToTop();
        }}
      >
        Zurück
      </Button>
    );
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center p-8">
            <Loader />
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center p-8">
            <p>
              Ein Fehler ist aufgetreten:{" "}
              <b>{token ? "Ungültiges Token" : "Kein Token vorhanden"}.</b>
            </p>
          </div>
        );

      case "alreadyAnswered":
        return (
          <div className="flex flex-col items-center p-8">
            <p>Die Umfrage wurde bereits beantwortet.</p>
            <p>
              <b>Vielen Dank!</b>
            </p>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center p-8">
            <p>Wir haben deine Auswahl erhalten.</p>
            <p>
              <b>Vielen Dank!</b>
            </p>
          </div>
        );

      default:
        return (
          <div>
            <StepperIndicator steps={decades.length + 1} active={activeStep} />
            <Stepper
              active={activeStep}
              onStepClick={setActiveStep}
              styles={{
                step: { display: "none" },
                steps: { display: "none" },
              }}
            >
              <Stepper.Step>
                <div className="max-w-[460px] m-auto flex flex-col gap-8 p-4 md:p-8">
                  <h2 className="text-2xl md:text-4xl font-bold">
                    Liebes Club-Mitglied,
                  </h2>
                  <p>
                    125 Jahre FCN. Was für eine Geschichte. Die goldenen 20er
                    Jahre. Die Titel in den 60ern. Die Dramen in den 70ern und
                    80ern. Der Absturz in den 90ern, beantwortet mit dem
                    Durchmarsch, um dann, dramatischer als je ein anderer
                    Verein, wieder abzusteigen. Und wenig später feiern wir den
                    Pokalsieg 2007. 125 Jahre FCN eben.
                  </p>
                  <p>
                    Gemeinsam mit Dir bestimmen wir die Jahrhundert+25-Elf.
                    Dabei geht es weder um die besten Elf oder die
                    erfolgreichsten Elf. Ziel ist es, ein Team
                    zusammenzustellen, das die 125-jährige Geschichte des 1. FC
                    Nürnberg abbildet. Und weil die Geschichte des 1. FC
                    Nürnberg ohne Max Morlock nicht vorstellbar ist, ist der
                    Weltmeister von 1954 natürlich gesetzt.
                  </p>
                  <p>
                    Für jede Dekade ab den 1920ern stellen wir Dir drei
                    herausragende Legenden zur Wahl. Wähle aus jeder Epoche den
                    Spieler, der für Dich am meisten herausragt. Mitmachen lohnt
                    sich natürlich. Unter allen teilnehmenden Mitgliedern
                    verlosen wir tolle Preise, darunter Tickets, Fanartikel und
                    ein Wochenende im Hotel Drei Raben – natürlich in der
                    Club-Suite, die mit den Bildern der Jahrhundert+25-Elf neu
                    gestaltet werden wird.
                  </p>
                  <Button
                    size="lg"
                    leftSection={<IconPlayerPlay size={20} />}
                    onClick={() => {
                      setIsGoingForward(true);
                      setTimeout(() => setActiveStep((prev) => prev + 1), 500);
                    }}
                  >
                    Jetzt abstimmen
                  </Button>
                </div>
              </Stepper.Step>
              {decades.map((decade) => (
                <Stepper.Step key={decade.year} label={decade.year}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={decade.year}
                      initial={{ opacity: 0, x: isGoingForward ? 50 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isGoingForward ? -50 : 50 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex flex-col gap-8"
                    >
                      <i className="text-4xl md:text-8xl text-center dimmed">
                        {decade.year}er
                      </i>
                      <div className="grid px-12 sm:px-0 sm:grid-cols-3 gap-4">
                        {decade.players.map((player) => {
                          const isSelected =
                            selectedPlayers[decade.year] === player.name;
                          return (
                            <div
                              key={player.name}
                              className={`relative cursor-pointer transition-transform ${
                                isSelected
                                  ? "bg-[var(--mantine-primary-color-filled)]"
                                  : "bg-black/20 hover:bg-black/50"
                              } group`}
                              style={{
                                clipPath:
                                  "polygon(0% 0%, 75% 0%, 100% 20%, 100% 100%, 0% 100%)",
                              }}
                              onClick={() =>
                                handleSelectPlayer(decade.year, player.name)
                              }
                            >
                              <div className="relative w-full aspect-square overflow-hidden">
                                <Image
                                  alt={`Bild ${player.name}`}
                                  src={`/players/${player.name}.jpg`}
                                  layout="fill"
                                  objectFit="cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 33vw, 480px"
                                  className="transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <h3 className="sm:text-xl text-center p-4">
                                {player.given} {player.name}
                              </h3>
                            </div>
                          );
                        })}
                      </div>
                      {activeStep > 0 && <BackButton />}
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>
              ))}
              <Stepper.Completed>
                <div className="max-w-[480px] m-auto flex flex-col gap-8 p-8">
                  <h2 className="text-4xl font-bold text-center">
                    Deine Auswahl
                  </h2>
                  <ul className="flex flex-col items-center gap-4">
                    {Object.entries(selectedPlayers).map(([decade, player]) => (
                      <li key={decade} className="flex flex-col items-center">
                        <i className="dimmed">{decade}er</i>
                        <h3 className="text-xl">{player}</h3>
                      </li>
                    ))}
                    <li className="flex flex-col items-center">
                      <i className="text-[var(--mantine-color-orange-9)]">
                        Jahrhundertspieler
                      </i>
                      <h3 className="text-xl text-[var(--mantine-color-orange-6)]">
                        Morlock
                      </h3>
                    </li>
                  </ul>
                  <div className="flex flex-col-reverse justify-center gap-2">
                    <BackButton />
                    <Button
                      size="lg"
                      leftSection={<IconSend size={20} />}
                      onClick={handleSubmit}
                    >
                      Auswahl abschicken
                    </Button>
                  </div>
                </div>
              </Stepper.Completed>
            </Stepper>
          </div>
        );
    }
  };

  return (
    <div id="top" className="flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-[1440px] mx-auto">
        <header className="flex justify-center items-center gap-4">
          <Logo />
        </header>
        {renderContent()}
      </div>
    </div>
  );
}
