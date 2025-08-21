import { sanitizeFileName } from "../../utils/filename";

describe("sanitizeFileName", () => {
  it("should convert spaces to dashes", () => {
    expect(sanitizeFileName("Lakers vs Warriors")).toBe(
      "Lakers-vs-Warriors.png",
    );
  });

  it("should remove special characters", () => {
    expect(sanitizeFileName("Our Team @ Opponent!")).toBe(
      "Our-Team-Opponent.png",
    );
  });

  it("should collapse multiple spaces into single dash", () => {
    expect(sanitizeFileName("  Team  A   vs   Team  B  ")).toBe(
      "Team-A-vs-Team-B.png",
    );
  });

  it("should handle numbers and letters", () => {
    expect(sanitizeFileName("123 vs ABC")).toBe("123-vs-ABC.png");
  });

  it("should handle only special characters", () => {
    expect(sanitizeFileName("!@#$%^&*()")).toBe("BoxScore.png");
  });

  it("should handle empty string", () => {
    expect(sanitizeFileName("")).toBe("BoxScore.png");
  });

  it("should handle custom file extension", () => {
    expect(sanitizeFileName("Team A vs Team B", "jpg")).toBe(
      "Team-A-vs-Team-B.jpg",
    );
  });

  it("should remove leading/trailing dashes", () => {
    expect(sanitizeFileName("@Lakers vs Warriors!")).toBe(
      "Lakers-vs-Warriors.png",
    );
  });

  it("should collapse multiple consecutive dashes", () => {
    expect(sanitizeFileName("Team--A---vs----Team--B")).toBe(
      "Team-A-vs-Team-B.png",
    );
  });

  it("should preserve existing dashes in names", () => {
    expect(sanitizeFileName("Some-Team vs Other-Team")).toBe(
      "Some-Team-vs-Other-Team.png",
    );
  });
});
