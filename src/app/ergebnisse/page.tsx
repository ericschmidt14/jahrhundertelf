"use client";
import { Button, Pagination, Table, Tabs, TextInput } from "@mantine/core";
import { IconLogout, IconSearch, IconTrophy } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import Login from "../components/login";
import Logo from "../components/logo";
import decades from "../data/players.json";
import { Result } from "../lib/interfaces";

export default function Page() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [playerCounts, setPlayerCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>("");

  const fetchData = () => {
    if (session) {
      fetch("/api", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data);

          const counts: { [key: string]: number } = {};
          data.forEach(({ spieler }: { spieler: string[] }) => {
            spieler.forEach((player) => {
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

  const filteredResults =
    results &&
    results
      .filter((r) => {
        const keywords = search.toLowerCase().split(" ");

        return keywords.every((keyword) =>
          [r.token].some((value) => value.toLowerCase().includes(keyword))
        );
      })
      .reverse();

  const pageLimit = 25;
  const pageSize = pageLimit ? +pageLimit : 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredResults.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResults.length / pageSize);

  return (
    <div className="flex flex-col items-center gap-4">
      <Tabs variant="pills" defaultValue="summary" className="w-full">
        <header className="w-full flex justify-between items-center px-8 py-2 bg-black/50">
          <Logo />
          <Tabs.List>
            <Tabs.Tab value="summary">Ergebnisse</Tabs.Tab>
            <Tabs.Tab value="details">Abstimmungen</Tabs.Tab>
          </Tabs.List>
          <Button
            variant="light"
            leftSection={<IconLogout size={16} />}
            onClick={() => signOut()}
          >
            Ausloggen
          </Button>
        </header>

        <Tabs.Panel value="summary">
          <div className="p-8">
            <Table withRowBorders={false} verticalSpacing="md">
              <Table.Tbody>
                {decades.map(({ year, players }) => {
                  const sortedPlayers = [...players].sort(
                    (a, b) =>
                      (playerCounts[b.name] || 0) - (playerCounts[a.name] || 0)
                  );

                  return (
                    <Table.Tr key={year}>
                      <Table.Td>
                        <i className="text-xl dimmed">{year}er</i>
                      </Table.Td>
                      {sortedPlayers.map(({ name, given }, index) => (
                        <Table.Td key={name}>
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <IconTrophy
                                size={64}
                                stroke={1}
                                color="var(--mantine-color-orange-9)"
                              />
                            )}
                            <div className="flex flex-col items-start">
                              <h3
                                className={`text-xl ${
                                  index === 0 &&
                                  "text-[var(--mantine-color-orange-6)]"
                                }`}
                              >
                                {given} {name}
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
                          </div>
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="details">
          <div className="w-full flex flex-col gap-4 p-8">
            <TextInput
              placeholder="Suchen ..."
              leftSection={<IconSearch size={16} />}
              rightSection={<p>{filteredResults.length}</p>}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              styles={{
                input: {
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid rgb(66, 66, 66)",
                },
              }}
            />
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Mitglied</Table.Th>
                  <Table.Th>Token</Table.Th>
                  <Table.Th>Spieler</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {currentPageData.map((result) => (
                  <Table.Tr key={result.token}>
                    <Table.Td>
                      <p>
                        <b>
                          {result.vorname} {result.nachname}
                        </b>
                      </p>
                      <p className="dimmed">{result.email}</p>
                    </Table.Td>
                    <Table.Td className="font-mono">{result.token}</Table.Td>
                    <Table.Td>{result.spieler.join(", ")}</Table.Td>
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
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
