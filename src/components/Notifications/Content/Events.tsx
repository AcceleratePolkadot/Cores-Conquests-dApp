import { useEffect, useState } from "react";
import type React from "react";

import type { SystemEvent } from "@polkadot-api/observable-client";
import _ from "lodash";

import { fromCamelCase, toApTitleCase } from "@/utils/typography";

import EventIcon from "@/components/EventIcon";
import Divider from "./Divider";
import Row from "./Row";

import type { EventsProps } from "./types";

const Events: React.FC<EventsProps> = ({ events }) => {
  const [cleanedEvents, setCleanedEvents] = useState<SystemEvent["event"][]>([]);

  useEffect(() => {
    const cleanValue = (
      value: SystemEvent["event"]["value"]["value"],
    ): SystemEvent["event"]["value"]["value"] => {
      if (_.isObject(value)) {
        if (_.keys(value).includes("dispatch_info")) {
          return {
            // @ts-ignore - we check for dispatch_info above
            "Pays Fee": value.dispatch_info.pays_fee.type,
            // @ts-ignore (why does TS not have ignore blocks yet?)
            "Ref time": value.dispatch_info.weight.ref_time,
            // @ts-ignore
            "Proof Size": value.dispatch_info.weight.proof_size,
          };
        }

        _.each(value, (val, key) => {
          if (_.isObject(val)) {
            if (_.keys(val).includes("asHex")) {
              // @ts-ignore - we check to ensure val has an asHex method above
              value[key] = val.asHex();
            } else if (_.keys(val).includes("asText")) {
              // @ts-ignore - see asHex (like REALLY ignore blocks would be so nice)
              value[key] = val.asText();
            }
          }
        });
      }
      return value;
    };
    const cleanEvent = (event: SystemEvent["event"]): SystemEvent["event"] => {
      if (event.value?.value === undefined && _.keys(event.value).length > 1) {
        const objWithValueKey = _.find(
          event.value,
          (item) => _.isObject(item) && _.keys(item).includes("value"),
        );
        if (objWithValueKey) {
          return cleanEvent(objWithValueKey);
        }
        const objWithDispatchInfoKey = _.find(
          event.value,
          (item) => _.isObject(item) && _.keys(item).includes("dispatch_info"),
        );
        if (objWithDispatchInfoKey) {
          return {
            ...event,
            value: {
              type: "Fee Info",
              value: `Pays Fee: ${objWithDispatchInfoKey.dispatch_info.pays_fee} • Ref time: ${objWithDispatchInfoKey.dispatch_info.weight.ref_time} • Proof Size: ${objWithDispatchInfoKey.dispatch_info.weight.proof_size}`,
            },
          };
        }
      }
      return {
        ...event,
        value: {
          ...event.value,
          value: cleanValue(event.value.value),
        },
      };
    };

    if (!events?.length) {
      setCleanedEvents([]);
    } else {
      const $events = events.map(cleanEvent);
      setCleanedEvents($events);
    }
  }, [events]);

  return (
    <>
      {cleanedEvents.length > 0 && (
        <div className="space-y-1 dark:bg-inherit">
          <Divider label="Events" />
          {cleanedEvents.map((event, index) => (
            <div key={`${event.type}-${index}`} className="pb-2">
              <Row
                value={`${toApTitleCase(fromCamelCase(event.type))}${event?.value?.type ? ` → ${toApTitleCase(fromCamelCase(event?.value?.type))}` : undefined}`}
                icon={<EventIcon eventName={event.type} />}
              />
              <div className="mt-1 ml-6 space-y-1">
                {event.value?.value &&
                  _.keys(event.value.value).map((key) => (
                    <Row key={key} value={event.value.value[key]} label={key} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Events;
