"use client";
import { Button, Stepper } from "@mantine/core";
import { IconChevronLeft, IconSend } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/legacy/image";
import { useState } from "react";
import StepperIndicator from "./components/stepper";
import decades from "./data/players.json";
import { getDecade } from "./lib/utils";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [isGoingForward, setIsGoingForward] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleSelectPlayer = (decade: number, playerName: string) => {
    setSelectedPlayers((prev) => ({ ...prev, [decade]: playerName }));
    setIsGoingForward(true);
    setTimeout(() => setActiveStep((prev) => prev + 1), 500);
  };

  const BackButton = () => {
    return (
      <Button
        variant="transparent"
        leftSection={<IconChevronLeft size={16} />}
        onClick={() => {
          setIsGoingForward(false);
          setTimeout(() => setActiveStep(activeStep - 1), 100);
        }}
      >
        Zurück
      </Button>
    );
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-[1440px] mx-auto">
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
                    <i className="text-8xl text-center dimmed">
                      {getDecade(decade.year)}
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
                      <i className="dimmed">{getDecade(+decade)}</i>
                      <h3 className="text-xl">{player}</h3>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col-reverse justify-center gap-2">
                  <BackButton />
                  <Button
                    leftSection={<IconSend size={16} />}
                    onClick={() =>
                      console.log(
                        JSON.stringify(
                          { players: Object.values(selectedPlayers) },
                          null,
                          2
                        )
                      )
                    }
                  >
                    Auswahl abschicken
                  </Button>
                </div>
              </div>
            </Stepper.Completed>
          </Stepper>
        </div>
      </div>
    </div>
  );
}
