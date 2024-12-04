import { BsFillCollectionFill } from "react-icons/bs";
import { FaMailBulk } from "react-icons/fa";
import { FaMoneyBillTransfer, FaPeopleGroup, FaRegCircleDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { GiCrossedAxes } from "react-icons/gi";
import { GoPasskeyFill } from "react-icons/go";
import { IoWallet } from "react-icons/io5";
import { IoLinkSharp } from "react-icons/io5";
import { LiaNetworkWiredSolid } from "react-icons/lia";
import { RiStackedView } from "react-icons/ri";
import { RiShieldUserFill } from "react-icons/ri";
import { SiParitysubstrate } from "react-icons/si";

import { bloc } from "@polkadot-api/descriptors";
import { useEffect, useState } from "react";

import { LuHeartHandshake } from "react-icons/lu";

import _ from "lodash";

interface EventIconProps {
  eventName: string;
}

const EventIcon: React.FC<EventIconProps> = ({ eventName }) => {
  const [descriptors, setDescriptors] = useState<(typeof bloc)["descriptors"] | undefined>(
    undefined,
  );
  const [eventsList, setEventsList] = useState<unknown | undefined>(undefined);
  const [icon, setIcon] = useState<React.ReactNode>(<FaRegCircleDot />);

  useEffect(() => {
    const descriptorsWrapper = async () => {
      const descriptors = await bloc.descriptors;
      setDescriptors(descriptors);
    };
    descriptorsWrapper();
  }, []);

  useEffect(() => {
    if (!descriptors) return;
    const events = "events" in descriptors ? descriptors.events : undefined;
    setEventsList(events);
  }, [descriptors]);

  useEffect(() => {
    let eventBaseName = undefined;
    if (eventsList) {
      eventBaseName = _.keys(eventsList).includes(eventName) ? eventName : undefined;

      if (!eventBaseName) {
        _.forEach(eventsList, (event, baseName) => {
          if (_.keys(event).includes(eventName)) {
            eventBaseName = baseName;
          }
        });
      }
    }

    switch (eventBaseName) {
      case "Aura":
      case "AuraExt":
        setIcon(<LuHeartHandshake />);
        break;
      case "Authorship":
        setIcon(<RiStackedView />);
        break;
      case "Balances":
        setIcon(<IoWallet />);
        break;
      case "CollatorSelection":
        setIcon(<BsFillCollectionFill />);
        break;
      case "CumulusXcm":
      case "PolkadotXcm":
        setIcon(<LiaNetworkWiredSolid />);
        break;
      case "ParachainInfo":
      case "ParachainSystem":
        setIcon(<IoLinkSharp />);
        break;
      case "Quest":
        setIcon(<GiCrossedAxes />);
        break;
      case "Roster":
        setIcon(<FaPeopleGroup />);
        break;
      case "Session":
        setIcon(<RiShieldUserFill />);
        break;
      case "Sudo":
        setIcon(<GoPasskeyFill />);
        break;
      case "System":
        setIcon(<SiParitysubstrate />);
        break;
      case "Timestamp":
        setIcon(<FaClock />);
        break;
      case "TransactionPayment":
        setIcon(<FaMoneyBillTransfer />);
        break;
      case "XcmpQueue":
        setIcon(<FaMailBulk />);
        break;
      default:
        setIcon(<FaRegCircleDot />);
    }
  }, [eventsList, eventName]);

  return icon;
};

export default EventIcon;
