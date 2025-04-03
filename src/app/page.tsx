import Logo from "./components/logo";
import decades from "./data/players.json";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center gap-4 p-4 md:p-8">
      <Logo />
      <div className="flex flex-col items-center p-8">
        <p>Die Umfrage wurde bereits beendet.</p>
        <p>Vielen Dank fürs Abstimmen!</p>
      </div>
      <ul className="grid sm:grid-cols-2 items-center gap-8 pb-8">
        {decades.map((d, i) => {
          const selectedPlayer = d.players.filter((p) => p.won)[0];
          const selectedPlayerName = `${selectedPlayer.given} ${selectedPlayer.name}`;

          return (
            <li key={i} className="flex flex-col items-center">
              <i className="dimmed">{d.year}er</i>
              <h3 className="text-xl">{selectedPlayerName}</h3>
              <p className="dimmed">{selectedPlayer.votes} Stimmen</p>
            </li>
          );
        })}
        <li className="sm:col-span-2 flex flex-col items-center">
          <i className="text-[var(--mantine-color-orange-9)]">
            Jahrhundertspieler
          </i>
          <h3 className="text-xl text-[var(--mantine-color-orange-6)]">
            Max Morlock
          </h3>
          <p className="text-[var(--mantine-color-orange-9)]">5810 Stimmen</p>
        </li>
      </ul>
    </div>
  );
}
