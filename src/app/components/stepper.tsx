import { Box } from "@mantine/core";

export default function StepperIndicator({
  steps,
  active,
}: {
  steps: number;
  active: number;
}) {
  return (
    <Box
      style={{
        width: "100vw",
        height: "2px",
        overflow: "hidden",
        position: "fixed",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        top: "0",
        left: "0",
        zIndex: "1000",
      }}
    >
      <Box
        style={{
          height: "100%",
          width: `${(active / steps) * 100}%`,
          backgroundColor: "var(--mantine-primary-color-filled)",
          transition: "width 0.3s ease",
        }}
      />
    </Box>
  );
}
