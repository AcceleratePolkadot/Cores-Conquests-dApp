import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";
import { useLazyLoadQuery } from "@reactive-dot/react";
import clsx from "clsx";
import type React from "react";

import { GiVote } from "react-icons/gi";
import { MdGroupRemove } from "react-icons/md";
import { TbNumber } from "react-icons/tb";

import { type Periods, calculateProgress } from "@/components/PeriodProgress";
import { fromCamelCase, toApTitleCase } from "@/utils/typography";
import { useEffect } from "react";
import { useState } from "react";

interface ExpulsionProposalStatusTimelineProps {
  proposal: ExpulsionProposal;
}

const ExpulsionProposalStatusTimeline: React.FC<ExpulsionProposalStatusTimelineProps> = ({
  proposal,
}) => {
  const [currentBlock, awaitingSecondPeriod, votingPeriod] = useLazyLoadQuery((builder) =>
    builder
      .readStorage("System", "Number", [])
      .getConstant("Roster", "ExpulsionProposalAwaitingSecondPeriod")
      .getConstant("Roster", "ExpulsionProposalVotingPeriod"),
  );

  const [awaitingSecondPeriodProgress, setAwaitingSecondPeriodProgress] = useState<
    Periods | undefined
  >(undefined);
  const [votingPeriodProgress, setVotingPeriodProgress] = useState<Periods | undefined>(undefined);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  useEffect(() => {
    setAwaitingSecondPeriodProgress(
      calculateProgress({
        periodStart: proposal.proposed_on,
        periodDuration: awaitingSecondPeriod,
        currentBlock,
      }),
    );
  }, [currentBlock, awaitingSecondPeriod, proposal.proposed_on]);

  useEffect(() => {
    if (proposal.voting_opened_on) {
      setVotingPeriodProgress(
        calculateProgress({
          periodStart: proposal.voting_opened_on,
          periodDuration: votingPeriod,
          currentBlock,
        }),
      );
    } else {
      setVotingPeriodProgress(undefined);
    }
  }, [currentBlock, votingPeriod, proposal.voting_opened_on]);

  useEffect(() => {
    if (["Passed", "Dismissed", "DismissedWithPrejudice"].includes(proposal.status.type)) {
      setOverallProgress(100);
    } else {
      if (votingPeriodProgress === undefined) {
        // Awaiting seconds stretches from about 15% of status bar to 50%
        setOverallProgress(15 + (awaitingSecondPeriodProgress?.percentPassed ?? 0) * 0.35);
      } else {
        // Voting period stretches from 50% to 80%
        setOverallProgress(50 + votingPeriodProgress.percentPassed * 0.3);
      }
    }
  }, [awaitingSecondPeriodProgress, votingPeriodProgress, proposal.status.type]);

  return (
    <div className="mt-2 rounded-lg bg-gray-100 p-6 dark:bg-gray-800/50">
      <div className="grid grid-cols-3 gap-12 text-center">
        <div className="justify-center text-center text-teal-400">
          <MdGroupRemove className="mx-auto h-8 w-8" />

          <div className="mt-2 flex items-center justify-center gap-2 text-xs">
            <span>Block</span>
            <span className="flex items-center gap-0">
              <TbNumber />
              <span>{proposal.proposed_on.toLocaleString()}</span>
            </span>
          </div>
          <p className="mt-1">Proposal Submitted</p>
        </div>

        <div
          className={clsx("justify-center text-center text-orange-300", {
            "opacity-30": !proposal.voting_opened_on,
          })}
        >
          <GiVote className="mx-auto h-8 w-8" />

          <div className="mt-2 flex items-center justify-center gap-2 text-xs">
            <span>Block</span>
            <span className="flex items-center gap-0">
              <TbNumber />
              <span>
                {proposal.voting_opened_on ? proposal.voting_opened_on.toLocaleString() : "-"}
              </span>
            </span>
          </div>
          <p className="mt-1">Voting Opened</p>
        </div>

        <div
          className={clsx("justify-center text-center text-rose-400", {
            "opacity-50": !proposal.decided_on,
          })}
        >
          <MdGroupRemove className="mx-auto h-8 w-8" />

          <div className="mt-2 flex items-center justify-center gap-2 text-xs">
            <span>Block</span>
            <span className="flex items-center gap-0">
              <TbNumber />
              <span>{proposal.decided_on ? proposal.decided_on.toLocaleString() : "-"}</span>
            </span>
          </div>
          <p className="mt-1">
            {["Passed", "Dismissed", "DismissedWithPrejudice"].includes(proposal.status.type)
              ? toApTitleCase(fromCamelCase(proposal.status.type))
              : "Decision Made"}
          </p>
        </div>
      </div>

      <div className="mt-4 h-0.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-0.5 rounded-full"
          style={{
            width: `${overallProgress}%`,
            backgroundColor: getProgressColor(overallProgress),
          }}
        />
      </div>
    </div>
  );
};

export default ExpulsionProposalStatusTimeline;

const getProgressColor = (progress: number): string => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Define the color stops with their transition points
  const colors = {
    0: { r: 22, g: 189, b: 202 }, // rgb(22, 189, 202)   - stays solid until 25
    50: { r: 253, g: 186, b: 140 }, // rgb(253, 186, 140)   - transition 25-50, then solid until 75
    100: { r: 251, g: 113, b: 133 }, // rgb(251, 113, 133)   - transition 75-100
  };

  let r: number;
  let g: number;
  let b: number;

  if (clampedProgress <= 25) {
    // First 25% is solid first color
    return `#${colors[0].r.toString(16).padStart(2, "0")}${colors[0].g.toString(16).padStart(2, "0")}${colors[0].b.toString(16).padStart(2, "0")}`;
  }

  if (clampedProgress <= 50) {
    // Interpolate between first and second color (25-50)
    const ratio = (clampedProgress - 25) / 25;
    r = Math.round(colors[0].r + (colors[50].r - colors[0].r) * ratio);
    g = Math.round(colors[0].g + (colors[50].g - colors[0].g) * ratio);
    b = Math.round(colors[0].b + (colors[50].b - colors[0].b) * ratio);
  } else if (clampedProgress <= 75) {
    // Solid second color (50-75)
    return `#${colors[50].r.toString(16).padStart(2, "0")}${colors[50].g.toString(16).padStart(2, "0")}${colors[50].b.toString(16).padStart(2, "0")}`;
  } else {
    // Interpolate between second and final color (75-100)
    const ratio = (clampedProgress - 75) / 25;
    r = Math.round(colors[50].r + (colors[100].r - colors[50].r) * ratio);
    g = Math.round(colors[50].g + (colors[100].g - colors[50].g) * ratio);
    b = Math.round(colors[50].b + (colors[50].b - colors[50].b) * ratio);
  }

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
