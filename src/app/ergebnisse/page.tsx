"use client";
import { Button, Pagination, Table } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import Login from "../components/login";
import Logo from "../components/logo";
import decades from "../data/players.json";
import { Result } from "../lib/interfaces";
import { getDecade } from "../lib/utils";

export default function Page() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [playerCounts, setPlayerCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [page, setPage] = useState(1);

  const fetchData = () => {
    if (session) {
      fetch("/api", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data);

          const counts: { [key: string]: number } = {};
          data.forEach(({ players }: { players: string[] }) => {
            players.forEach((player) => {
              counts[player] = (counts[player] || 0) + 1;
            });
          });

          const sortedCounts = Object.fromEntries(
            Object.entries(counts).sort(([, a], [, b]) => b - a)
          );
          setPlayerCounts(sortedCounts);
        })
        .catch((error) => {
          setResults([]);
          console.error(error);
        });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    return <Login />;
  }

  const pageLimit = 25;
  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <div className="flex flex-col items-center gap-8">
      <header className="w-full flex justify-between items-center px-8 py-2 bg-black/50">
        <Logo />
        <Button
          variant="light"
          leftSection={<IconLogout size={16} />}
          onClick={() => signOut()}
        >
          Ausloggen
        </Button>
      </header>
      <div className="w-full flex flex-col gap-8 p-8">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Jahrzehnt</Table.Th>
              <Table.Th>Spieler</Table.Th>
              <Table.Th />
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {decades.map(({ year, players }) => {
              const sortedPlayers = [...players].sort(
                (a, b) =>
                  (playerCounts[b.name] || 0) - (playerCounts[a.name] || 0)
              );

              return (
                <Table.Tr key={year}>
                  <Table.Td>
                    <i className="text-xl dimmed">{getDecade(year)}</i>
                  </Table.Td>
                  {sortedPlayers.map(({ name }, index) => (
                    <Table.Td key={name} className="text-center">
                      <div className="flex flex-col items-start">
                        <h3
                          className={`text-xl ${
                            index === 0 &&
                            "text-[var(--mantine-color-orange-6)]"
                          }`}
                        >
                          {name}
                        </h3>
                        <p
                          className={`${
                            index === 0
                              ? "text-[var(--mantine-color-orange-9)]"
                              : "dimmed"
                          }`}
                        >
                          {playerCounts[name] || 0}x gewählt
                        </p>
                      </div>
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Token</Table.Th>
              <Table.Th>Spieler</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {currentPageData.map((result) => (
              <Table.Tr key={result.token}>
                <Table.Td className="font-mono">{result.token}</Table.Td>
                <Table.Td>{result.players.join(", ")}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Pagination
          value={page}
          onChange={setPage}
          total={totalPages}
          className="flex justify-center"
        />
      </div>
    </div>
  );
}
