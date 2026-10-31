# Wildkin 3.0 release candidate

Candidate: 3.0.0-rc.1. Existing public deployment remains unchanged pending a release decision.

Campaign integration: all three mapped missions and one chosen story arc in each region precede its Guardian. Earned seals from existing saves remain valid. Additional story arcs, hidden reports and regional requests stay optional. Guided practice defaults to compact coaching; detailed move help is opt-in.

Available QA: automated regression, every starter through both approaches, completionist traversal, all-family battle simulations, all six puzzle engines, save migration/restore/reset/failures/concurrency and modeled offline/update checks. Current Chrome preview checks all eight screens at 305 px content width without horizontal overflow, fresh onboarding and guided practice. The initial text-heavy practice panel was corrected. Earlier Chrome art, puzzle and actual IndexedDB concurrency review is recorded in QA_REPORT.md.

Limitations requiring an explicit release decision against RELEASE_SPEC_3_0.md: main campaign agents complete in 30–48 battles with zero defeats. This does not establish the 8–12-hour design target. No observed human pacing or target-age enjoyment test, physical iPhone/Home Screen acceptance, audible sound review or device performance/battery measurement has occurred. Current browser review does not close those gates. Do not claim the full original acceptance criteria are met.

Publication, if approved with those limitations: preserve main source in a backup branch, replace only the Wildkin subtree and its regression workflow while preserving unrelated games, wait for CI and GitHub Pages, verify live version/assets, and retain storage key/origin and schema reader. Publish release notes listing the limitations. Existing saves are retained. A fresh adventure requires Camp > Export backup > Start a fresh adventure, check the explicit confirmation and choose a starter.
