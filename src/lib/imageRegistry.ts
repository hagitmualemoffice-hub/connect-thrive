// Maps legacy "/src/assets/..." paths and bare filenames to bundled image URLs.
// This lets the DB store stable string paths while Vite resolves them in the browser.
import pesachFreedom from "@/assets/blog-pesach-freedom.jpg";
import bereshitImg from "@/assets/blog-bereshit.jpg";
import lagBaomerImg from "@/assets/blog-lag-baomer.jpg";
import akedaTearsImg from "@/assets/blog-akeda-tears.jpg";
import whenLifeHitsImg from "@/assets/blog-when-life-hits-hard.jpg";
import anxietyMeetingsImg from "@/assets/blog-anxiety-meetings.jpg";
import entrepreneurshipFailureImg from "@/assets/blog-entrepreneurship-failure.jpg";
import blogBatEcholocationImg from "@/assets/blog-bat-echolocation.jpg";
import blogGameBoardImg from "@/assets/blog-game-board.jpg";
import blogExperientialValuesImg from "@/assets/blog-experiential-values.jpg";
import blogShlachAsset from "@/assets/blog-shlach.jpg.asset.json";
import blogBalakEyesOpened from "@/assets/blog-balak-eyes-opened.jpg";
import blogPinchasPeace from "@/assets/blog-pinchas-peace.jpg";
import blogShlachPromisedLand from "@/assets/blog-shlach-promised-land.jpg";
import blogMatotHonesty from "@/assets/blog-matot-honesty.jpg";

const registry: Record<string, string> = {
  "blog-balak-eyes-opened.jpg": blogBalakEyesOpened,
  "blog-pinchas-peace.jpg": blogPinchasPeace,
  "blog-shlach-promised-land.jpg": blogShlachPromisedLand,
  "blog-matot-honesty.jpg": blogMatotHonesty,
  "blog-pesach-freedom.jpg": pesachFreedom,
  "blog-bereshit.jpg": bereshitImg,
  "blog-lag-baomer.jpg": lagBaomerImg,
  "blog-akeda-tears.jpg": akedaTearsImg,
  "blog-when-life-hits-hard.jpg": whenLifeHitsImg,
  "blog-anxiety-meetings.jpg": anxietyMeetingsImg,
  "blog-entrepreneurship-failure.jpg": entrepreneurshipFailureImg,
  "blog-bat-echolocation.jpg": blogBatEcholocationImg,
  "blog-game-board.jpg": blogGameBoardImg,
  "blog-experiential-values.jpg": blogExperientialValuesImg,
  "blog-shlach.jpg": blogShlachAsset.url,
};

export function resolveImageUrl(input?: string | null): string | undefined {
  if (!input) return undefined;
  // Already an absolute URL (http/https) or asset URL token
  if (/^https?:\/\//.test(input)) return input;
  if (input.startsWith("__ASSET_URL__")) {
    const name = input.replace("__ASSET_URL__", "");
    return registry[name];
  }
  // Strip leading paths
  const filename = input.split("/").pop() || input;
  return registry[filename] ?? input;
}
