"use client";
import { Button, Stepper } from "@mantine/core";
import { IconChevronLeft, IconSend } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/legacy/image";
import { useState } from "react";
import StepperIndicator from "./components/stepper";
import decades from "./data/players.json";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleSelectPlayer = (decade: number, playerName: string) => {
    setSelectedPlayers((prev) => ({ ...prev, [decade]: playerName }));
    setTimeout(() => setActiveStep((prev) => prev + 1), 500);
  };

  return (
    <div className="flex flex-col p-8">
      <header className="flex justify-center items-center gap-4">
        <div className="flex items-center gap-1">
          <Image
            src="/logo_transparent.svg"
            width={48}
            height={48}
            alt="1. FCN Logo"
          />
          <h1 className="text-2xl">
            Jahrhundert<i>Elf</i>
          </h1>
        </div>
      </header>
      <div>
        <StepperIndicator steps={decades.length} active={activeStep} />
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          styles={{
            step: { display: "none" },
            steps: { display: "none" },
          }}
        >
          {decades.map((decade, index) => (
            <Stepper.Step key={decade.year} label={decade.year}>
              <AnimatePresence mode="wait">
                {activeStep === index && (
                  <motion.div
                    key={decade.year}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col gap-8"
                  >
                    <i className="text-8xl text-center dimmed">
                      {decade.year} – {decade.year + 9}
                    </i>
                    <div className="grid grid-cols-3 gap-4">
                      {decade.players.map((player) => {
                        const isSelected =
                          selectedPlayers[decade.year] === player.name;
                        return (
                          <div
                            key={player.name}
                            className={`relative cursor-pointer transition-transform ${
                              isSelected
                                ? "bg-[var(--mantine-primary-color-filled)]"
                                : "bg-black/20 hover:bg-[var(--mantine-primary-color-filled-hover)]"
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
                                src="/players/1.png"
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <h3 className="text-xl text-center p-4">
                              {player.name}
                            </h3>
                          </div>
                        );
                      })}
                    </div>
                    {activeStep > 0 && (
                      <Button
                        variant="transparent"
                        leftSection={<IconChevronLeft size={16} />}
                        onClick={() => setActiveStep(activeStep - 1)}
                      >
                        Zurück
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Stepper.Step>
          ))}
        </Stepper>

        {activeStep === decades.length && (
          <div className="max-w-[400px] m-auto flex flex-col gap-8 p-8">
            <h2 className="text-4xl font-bold text-center">Deine Auswahl</h2>
            <ul className="flex flex-col items-center">
              {Object.entries(selectedPlayers).map(([decade, player]) => (
                <li key={decade}>
                  <b>{decade}</b> {player}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button
                variant="transparent"
                leftSection={<IconChevronLeft size={16} />}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Zurück
              </Button>
              <Button
                leftSection={<IconSend size={16} />}
                onClick={() =>
                  console.log(
                    JSON.stringify(Object.values(selectedPlayers), null, 2)
                  )
                }
              >
                Auswahl abschicken
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
