import NavbarSidebarLayout from "@/layouts/NavbarSidebarLayout";
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, Select, TextInput, ToggleSwitch } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { FaDribbble, FaFacebookF, FaGithub, FaTwitter } from "react-icons/fa";
import { HiCloudUpload, HiDesktopComputer, HiDeviceMobile } from "react-icons/hi";

import { RostersList } from "@/components/Rosters";

const Home: FC = () => (
  <NavbarSidebarLayout>
    <>
      <div className="grid grid-cols-1 gap-y-6 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="col-span-full">
          <h1 className="font-semibold text-gray-900 text-xl sm:text-2xl dark:text-white">
            User settings
          </h1>
        </div>
        <div className="col-span-full">
          <RostersList />
        </div>
      </div>
    </>
  </NavbarSidebarLayout>
);

const UserProfileCard: FC = () => (
  <Card>
    <div className="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
      <img
        alt=""
        src="../../images/users/jese-leos-2x.png"
        className="mb-4 h-28 w-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
      />
      <div>
        <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">Jese Leos</h3>
        <div className="mb-4 font-normal text-base text-gray-500 dark:text-gray-400">
          Software Engineer
        </div>
        <a
          href="#placeholder"
          className="inline-flex items-center rounded-lg bg-primary-700 px-3 py-2 text-center font-medium text-sm text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:focus:ring-primary-800 dark:hover:bg-primary-700"
        >
          <HiCloudUpload className="mr-2" />
          Change picture
        </a>
      </div>
    </div>
  </Card>
);

const LanguageTimeCard: FC = () => (
  <Card>
    <h3 className="font-bold text-xl dark:text-white">Language &amp; Time</h3>
    <div className="mb-1 grid grid-cols-1 gap-y-2">
      <Label htmlFor="settings-language">Select language</Label>
      <Select id="settings-language" name="settings-language">
        <option>English (US)</option>
        <option>Italiano</option>
        <option>Français (France)</option>
        <option>正體字</option>
        <option>Español (España)</option>
        <option>Deutsch</option>
        <option>Português (Brasil)</option>
      </Select>
    </div>
    <div className="mb-3 grid grid-cols-1 gap-y-2">
      <Label htmlFor="settings-timezone">Time Zone</Label>
      <Select id="settings-timezone" name="settings-timezone">
        <option>GMT+0 Greenwich Mean Time (GMT)</option>
        <option>GMT+1 Central European Time (CET)</option>
        <option>GMT+2 Eastern European Time (EET)</option>
        <option>GMT+3 Moscow Time (MSK)</option>
        <option>GMT+5 Pakistan Standard Time (PKT)</option>
        <option>GMT+8 China Standard Time (CST)</option>
        <option>GMT+10 Eastern Australia Standard Time (AEST)</option>
      </Select>
    </div>
    <div>
      <Button color="primary">Save all</Button>
    </div>
  </Card>
);

const SocialAccountsCard: FC = () => (
  <Card>
    <div className="flow-root">
      <h3 className="font-bold text-xl dark:text-white">Social accounts</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        <li className="py-4">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <FaFacebookF className="text-xl dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-base text-gray-900 dark:text-white">
                Facebook account
              </span>
              <a
                href="#placeholder"
                className="block truncate font-normal text-primary-700 text-sm hover:underline dark:text-primary-500"
              >
                www.facebook.com/themesberg
              </a>
            </div>
            <div className="inline-flex items-center">
              <Button color="gray" href="#placeholder">
                Disconnect
              </Button>
            </div>
          </div>
        </li>
        <li className="py-4">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <FaTwitter className="text-xl dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-base text-gray-900 dark:text-white">
                Twitter account
              </span>
              <a
                href="#placeholder"
                className="block truncate font-normal text-primary-700 text-sm hover:underline dark:text-primary-500"
              >
                www.twitter.com/themesberg
              </a>
            </div>
            <div className="inline-flex items-center">
              <Button color="gray" href="#placeholder">
                Disconnect
              </Button>
            </div>
          </div>
        </li>
        <li className="py-4">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <FaGithub className="text-xl dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-base text-gray-900 dark:text-white">
                Github account
              </span>
              <span className="block truncate font-normal text-gray-500 text-sm dark:text-gray-400">
                Not connected
              </span>
            </div>
            <div className="inline-flex items-center">
              <Button color="primary" href="#placeholder">
                Connect
              </Button>
            </div>
          </div>
        </li>
        <li className="pt-4 pb-6">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <FaDribbble className="text-xl dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-base text-gray-900 dark:text-white">
                Dribbble account
              </span>
              <span className="block truncate font-normal text-gray-500 text-sm dark:text-gray-400">
                Not connected
              </span>
            </div>
            <div className="inline-flex items-center">
              <Button color="primary" href="#placeholder">
                Connect
              </Button>
            </div>
          </div>
        </li>
      </ul>
      <Button color="primary">Save all</Button>
    </div>
  </Card>
);

const OtherAccountsCard: FC = () => (
  <Card>
    <div className="flow-root">
      <h3 className="font-bold text-xl dark:text-white">Other accounts</h3>
      <ul className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
        <li className="py-4">
          <div className="flex justify-between xl:block 2xl:flex 2xl:space-x-4">
            <div className="flex space-x-4 xl:mb-4 2xl:mb-0">
              <div>
                <img
                  alt=""
                  src="../../images/users/bonnie-green.png"
                  className="h-6 w-6 rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 truncate font-semibold text-base text-gray-900 leading-none dark:text-white">
                  Bonnie Green
                </p>
                <p className="mb-1 truncate font-normal text-primary-700 text-sm dark:text-primary-500">
                  New York, USA
                </p>
                <p className="font-medium text-gray-500 text-xs dark:text-gray-400">
                  Last seen: 1 min ago
                </p>
              </div>
            </div>
            <div className="inline-flex w-auto items-center xl:w-full 2xl:w-auto">
              <Button color="gray" href="#placeholder">
                Disconnect
              </Button>
            </div>
          </div>
        </li>
        <li className="py-4">
          <div className="flex justify-between xl:block 2xl:flex 2xl:space-x-4">
            <div className="flex space-x-4 xl:mb-4 2xl:mb-0">
              <div>
                <img
                  alt=""
                  src="../../images/users/jese-leos.png"
                  className="h-6 w-6 rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 truncate font-semibold text-base text-gray-900 leading-none dark:text-white">
                  Jese Leos
                </p>
                <p className="mb-1 truncate font-normal text-primary-700 text-sm dark:text-primary-500">
                  California, USA
                </p>
                <p className="font-medium text-gray-500 text-xs dark:text-gray-400">
                  Last seen: 2 min ago
                </p>
              </div>
            </div>
            <div className="inline-flex w-auto items-center xl:w-full 2xl:w-auto">
              <Button color="gray" href="#placeholder">
                Disconnect
              </Button>
            </div>
          </div>
        </li>
        <li className="py-4">
          <div className="flex justify-between xl:block 2xl:flex 2xl:space-x-4">
            <div className="flex space-x-4 xl:mb-4 2xl:mb-0">
              <div>
                <img
                  className="h-6 w-6 rounded-full"
                  src="../../images/users/thomas-lean.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 truncate font-semibold text-base text-gray-900 leading-none dark:text-white">
                  Thomas Lean
                </p>
                <p className="mb-1 truncate font-normal text-primary-700 text-sm dark:text-primary-500">
                  Texas, USA
                </p>
                <p className="font-medium text-gray-500 text-xs dark:text-gray-400">
                  Last seen: 1 hour ago
                </p>
              </div>
            </div>
            <div className="inline-flex w-auto items-center xl:w-full 2xl:w-auto">
              <Button color="gray" href="#placeholder">
                Disconnect
              </Button>
            </div>
          </div>
        </li>
        <li className="pt-4">
          <div className="flex justify-between xl:block 2xl:flex 2xl:space-x-4">
            <div className="flex space-x-4 xl:mb-4 2xl:mb-0">
              <div>
                <img
                  className="h-6 w-6 rounded-full"
                  src="../../images/users/lana-byrd.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 truncate font-semibold text-base text-gray-900 leading-none dark:text-white">
                  Lana Byrd
                </p>
                <p className="mb-1 truncate font-normal text-primary-700 text-sm dark:text-primary-500">
                  Texas, USA
                </p>
                <p className="font-medium text-gray-500 text-xs dark:text-gray-400">
                  Last seen: 1 hour ago
                </p>
              </div>
            </div>
            <div className="inline-flex w-auto items-center xl:w-full 2xl:w-auto">
              <Button color="gray" href="#placeholder">
                Disconnect
              </Button>
            </div>
          </div>
        </li>
      </ul>
      <Button color="primary">Save all</Button>
    </div>
  </Card>
);

const GeneralInformationCard: FC = () => (
  <Card>
    <h3 className="mb-4 font-bold text-xl dark:text-white">General information</h3>
    <form action="#">
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="first-name">First Name</Label>
          <TextInput id="first-name" name="first-name" placeholder="Bonnie" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="last-name">Last Name</Label>
          <TextInput id="last-name" name="last-name" placeholder="Green" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="country">Country</Label>
          <TextInput id="country" name="country" placeholder="United States" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="city">City</Label>
          <TextInput id="city" name="city" placeholder="San Francisco" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="address">Address</Label>
          <TextInput id="address" name="address" placeholder="California" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            name="email"
            placeholder="example@company.com"
            required
            type="email"
          />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="phone-number">Phone Number</Label>
          <TextInput
            id="phone-number"
            name="phone-number"
            placeholder="e.g., +(12)3456 789"
            required
            type="tel"
          />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="birthday">Birthday</Label>
          <TextInput
            id="birthday"
            name="birthday"
            placeholder="e.g., 15/08/1990"
            required
            type="date"
          />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="organization">Organization</Label>
          <TextInput id="organization" name="organization" placeholder="Company name" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="role">Role</Label>
          <TextInput id="role" name="role" placeholder="React Developer" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="department">Department</Label>
          <TextInput id="department" name="department" placeholder="Development" required />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="zip-code">ZIP/postal code</Label>
          <TextInput id="zip-code" name="zip-code" placeholder="12345" required />
        </div>
        <div className="col-span-6">
          <Button color="primary">Save all</Button>
        </div>
      </div>
    </form>
  </Card>
);

const PasswordInformationCard: FC = () => (
  <Card>
    <h3 className="mb-4 font-bold text-xl dark:text-white">Password information</h3>
    <form action="#">
      <div className="grid grid-cols-6 gap-6">
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="current-password">Current password</Label>
          <TextInput
            id="current-password"
            name="current-password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="new-password">New password</Label>
          <TextInput id="new-password" name="new-password" placeholder="••••••••" type="password" />
        </div>
        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <TextInput
            id="confirm-password"
            name="confirm-password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <div className="col-span-full">
          <div className="font-medium text-sm dark:text-white">Password requirements:</div>
          <div className="mb-1 font-normal text-gray-500 text-sm dark:text-gray-400">
            Ensure that these requirements are met:
          </div>
          <ul className="space-y-1 pl-4 text-gray-500 dark:text-gray-400">
            <li className="font-normal text-xs">
              At least 10 characters (and up to 100 characters)
            </li>
            <li className="font-normal text-xs">At least one lowercase character</li>
            <li className="font-normal text-xs">
              Inclusion of at least one special character, e.g., ! @ # ?
            </li>
            <li className="font-normal text-xs">Some text here zoltan</li>
          </ul>
        </div>
        <div className="col-span-6">
          <Button color="primary">Save all</Button>
        </div>
      </div>
    </form>
  </Card>
);

const SessionsCard: FC = () => (
  <Card>
    <div className="flow-root">
      <h3 className="font-bold text-xl dark:text-white">Sessions</h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        <li className="py-4">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <HiDesktopComputer className="text-2xl dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-base text-gray-900 dark:text-white">
                California 123.123.123.123
              </p>
              <p className="truncate font-normal text-gray-500 text-sm dark:text-gray-400">
                Chrome on macOS
              </p>
            </div>
            <div className="inline-flex items-center">
              <Button color="gray">Revoke</Button>
            </div>
          </div>
        </li>
        <li className="pt-4 pb-6">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <HiDeviceMobile className="text-2xl dark:text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-base text-gray-900 dark:text-white">
                Rome 24.456.355.98
              </p>
              <p className="truncate font-normal text-gray-500 text-sm dark:text-gray-400">
                Safari on iPhone
              </p>
            </div>
            <div className="inline-flex items-center">
              <Button color="gray">Revoke</Button>
            </div>
          </div>
        </li>
      </ul>
      <Button color="primary">See more</Button>
    </div>
  </Card>
);

const AlertsNotificationsCard: FC = () => {
  const [isCompanyNews, setCompanyNews] = useState(true);
  const [isAccountActivity, setAccountActivity] = useState(true);
  const [isMeetupsNearYou, setMeetupsNearYou] = useState(true);
  const [isNewMessages, setNewMessages] = useState(false);

  return (
    <Card>
      <div className="flow-root">
        <h3 className="font-bold text-xl dark:text-white">Alerts &amp; Notifications</h3>
        <p className="font-normal text-gray-500 text-sm dark:text-gray-400">
          You can set up Themesberg to get notifications
        </p>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-center justify-between py-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Company News
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Get Themesberg news, announcements, and product updates
              </div>
            </div>
            <Label htmlFor="company-news" className="sr-only">
              Toggle company news
            </Label>
            <ToggleSwitch
              checked={isCompanyNews}
              id="company-news"
              label=""
              name="company-news"
              onChange={() => setCompanyNews(!isCompanyNews)}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Account Activity
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Get important notifications about you or activity you've missed
              </div>
            </div>
            <Label htmlFor="account-activity" className="sr-only">
              Toggle account activity
            </Label>
            <ToggleSwitch
              checked={isAccountActivity}
              id="account-activity"
              label=""
              name="account-activity"
              onChange={() => setAccountActivity(!isAccountActivity)}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Meetups Near You
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Get an email when a Dribbble Meetup is posted close to my location
              </div>
            </div>
            <Label htmlFor="meetups-near-you" className="sr-only">
              Toggle meetups near you
            </Label>
            <ToggleSwitch
              checked={isMeetupsNearYou}
              id="meetups-near-you"
              label=""
              name="meetups-near-you"
              onChange={() => setMeetupsNearYou(!isMeetupsNearYou)}
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                New Messages
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Get Themsberg news, announcements, and product updates
              </div>
            </div>
            <Label htmlFor="new-messages" className="sr-only">
              Toggle new messages
            </Label>
            <ToggleSwitch
              checked={isNewMessages}
              id="new-messages"
              label=""
              name="new-messages"
              onChange={() => setNewMessages(!isNewMessages)}
            />
          </div>
        </div>
        <div className="mt-6">
          <Button color="primary">Save all</Button>
        </div>
      </div>
    </Card>
  );
};

const EmailNotificationsCard: FC = () => {
  const [isRatingReminders, setRatingReminders] = useState(false);
  const [isItemUpdateNotifications, setItemUpdateNotifications] = useState(true);
  const [isItemCommentNotifications, setItemCommentNotifications] = useState(true);
  const [isBuyerReviewNotifications, setBuyerReviewNotifications] = useState(true);

  return (
    <Card>
      <div className="flow-root">
        <h3 className="font-bold text-xl dark:text-white">Email Notifications</h3>
        <p className="font-normal text-gray-500 text-sm dark:text-gray-400">
          You can set up Themesberg to get email notifications
        </p>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex items-center justify-between py-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Rating reminders
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Send an email reminding me to rate an item a week after purchase
              </div>
            </div>
            <Label htmlFor="rating-reminders" className="sr-only">
              Toggle rating reminders
            </Label>
            <ToggleSwitch
              checked={isRatingReminders}
              id="rating-reminders"
              label=""
              name="rating-reminders"
              onChange={() => setRatingReminders(!isRatingReminders)}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Item update notifications
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Send user and product notifications for you
              </div>
            </div>
            <Label htmlFor="item-update-notifications" className="sr-only">
              Toggle item update notifications
            </Label>
            <ToggleSwitch
              checked={isItemUpdateNotifications}
              id="item-update-notifications"
              label=""
              name="item-update-notifications"
              onChange={() => setItemUpdateNotifications(!isItemUpdateNotifications)}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Item comment notifications
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Send me an email when someone comments on one of my items
              </div>
            </div>
            <Label htmlFor="item-comment-notifications" className="sr-only">
              Toggle item comment notifications
            </Label>
            <ToggleSwitch
              checked={isItemCommentNotifications}
              id="item-comment-notifications"
              label=""
              name="item-comment-notifications"
              onChange={() => setItemCommentNotifications(!isItemCommentNotifications)}
            />
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex grow flex-col">
              <div className="font-semibold text-gray-900 text-lg dark:text-white">
                Buyer review notifications
              </div>
              <div className="font-normal text-base text-gray-500 dark:text-gray-400">
                Send me an email when someone leaves a review with their rating
              </div>
            </div>
            <Label htmlFor="buyer-review-notifications" className="sr-only">
              Toggle buyer review notifications
            </Label>
            <ToggleSwitch
              checked={isBuyerReviewNotifications}
              id="buyer-review-notifications"
              label=""
              name="buyer-review-notifications"
              onChange={() => setBuyerReviewNotifications(!isBuyerReviewNotifications)}
            />
          </div>
        </div>
        <div className="mt-6">
          <Button color="primary">Save all</Button>
        </div>
      </div>
    </Card>
  );
};

export default Home;
