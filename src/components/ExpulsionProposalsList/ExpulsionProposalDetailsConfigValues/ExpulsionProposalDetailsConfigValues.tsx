import type React from "react";
import { useEffect, useState } from "react";

import { useLazyLoadQuery } from "@reactive-dot/react";
import clsx from "clsx";

import { BalanceOdometer, PercentageOdometer } from "@/components/Odometers";
import { useRosters } from "@/contexts/Rosters";
import useBalanceFormatter from "@/hooks/useBalanceFormatter";

import { formatLockoutPeriod, formatReparations, periodRemainingStr } from "./formatters";

import type {
  ConfigItemCardsProps,
  ExpulsionProposalDetailsConfigValuesProps,
  configItem,
} from "./types";

const ExpulsionProposalDetailsConfigValues: React.FC<ExpulsionProposalDetailsConfigValuesProps> = ({
  proposal,
}) => {
  const { formatBalance } = useBalanceFormatter();
  const { getRoster } = useRosters();

  const [
    currentBlock,
    slotDuration,
    deposit,
    reparations,
    awaitingSecondPeriod,
    votingPeriod,
    secondThreshold,
    lockoutPeriod,
    superMajority,
    quorum,
  ] = useLazyLoadQuery((builder) =>
    builder
      .readStorage("System", "Number", [])
      .getConstant("Aura", "SlotDuration")
      .getConstant("Roster", "NewExpulsionProposalDeposit")
      .getConstant("Roster", "ExpulsionProposalReparations")
      .getConstant("Roster", "ExpulsionProposalAwaitingSecondPeriod")
      .getConstant("Roster", "ExpulsionProposalVotingPeriod")
      .getConstant("Roster", "ExpulsionProposalSecondThreshold")
      .getConstant("Roster", "ExpulsionProposalLockoutPeriod")
      .getConstant("Roster", "ExpulsionProposalSuperMajority")
      .getConstant("Roster", "ExpulsionProposalQuorum"),
  );

  const [costConfigs, setCostConfigs] = useState<configItem[]>([]);
  const [periodConfigs, setPeriodConfigs] = useState<configItem[]>([]);
  const [thresholdConfigs, setThresholdConfigs] = useState<configItem[]>([]);
  const [memberCount, setMemberCount] = useState<number>(0);

  const roster = getRoster(proposal.roster);

  if (!roster) {
    return null;
  }

  useEffect(() => {
    const memberCount = roster.members.length;
    setMemberCount(memberCount);
  }, [roster]);

  useEffect(() => {
    setCostConfigs([
      {
        label: "Deposit",
        value: <BalanceOdometer value={deposit} />,
      },
      formatReparations(
        reparations,
        formatBalance((BigInt(deposit) * BigInt(reparations)) / BigInt(100)),
      ),
      formatLockoutPeriod(lockoutPeriod, slotDuration),
    ]);
  }, [deposit, reparations, lockoutPeriod, slotDuration, formatBalance]);

  useEffect(() => {
    setPeriodConfigs([
      {
        label: "Awaiting Second Period",
        value: `${awaitingSecondPeriod} blocks`,
        subLabel: periodRemainingStr(
          awaitingSecondPeriod,
          proposal.proposed_on,
          currentBlock,
          slotDuration,
        ),
      },
      {
        label: "Voting Period",
        value: `${votingPeriod} blocks`,
        subLabel: periodRemainingStr(
          votingPeriod,
          proposal.voting_opened_on,
          currentBlock,
          slotDuration,
        ),
      },
    ]);
  }, [
    awaitingSecondPeriod,
    votingPeriod,
    proposal.proposed_on,
    proposal.voting_opened_on,
    currentBlock,
    slotDuration,
  ]);

  useEffect(() => {
    setThresholdConfigs([
      {
        label: "Number of Seconds",
        value: proposal.seconds.length.toString(),
        subLabel: `/ ${secondThreshold.toString()}`,
      },
      {
        label: "Super Majority",
        value: <PercentageOdometer value={superMajority} />,
        subLabel: `${memberCount * (superMajority / 100)} votes`,
      },
      {
        label: "Quorum",
        value: <PercentageOdometer value={quorum} />,
        subLabel: `${memberCount * (quorum / 100)} votes`,
      },
    ]);
  }, [secondThreshold, superMajority, quorum, memberCount, proposal.seconds]);

  return (
    <div className="mt-4">
      <ConfigItemCards configs={costConfigs} />
      <ConfigItemCards configs={periodConfigs} />
      <ConfigItemCards configs={thresholdConfigs} />
    </div>
  );
};

const ConfigItemCards: React.FC<ConfigItemCardsProps> = ({ configs }) => {
  return (
    <dl
      className={clsx("mt-5 grid grid-cols-1 gap-5", {
        "lg:grid-cols-2": configs.length === 2,
        "lg:grid-cols-3": configs.length === 3,
        "lg:grid-cols-4": configs.length > 3,
      })}
    >
      {configs.map((config) => (
        <div
          key={"id" in config ? config.id : config.label}
          className="overflow-hidden rounded-lg bg-gray-100/50 px-4 py-5 shadow-sm sm:p-6 dark:bg-slate-600/20 dark:text-white"
        >
          <dt className="truncate font-semibold text-slate-600 text-sm dark:text-slate-400">
            {config.label}
          </dt>
          <dd className="mt-1 flex items-end font-semibold text-3xl text-gray-900 tracking-tight dark:text-slate-100">
            {config.value}
            {config.subLabel && (
              <span className="ml-2 truncate text-gray-400 text-xs tracking-tight dark:text-slate-500">
                {config.subLabel}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ExpulsionProposalDetailsConfigValues;
