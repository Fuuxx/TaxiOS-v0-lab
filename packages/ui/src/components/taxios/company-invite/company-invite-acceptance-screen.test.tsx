import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import {
  demoCompanyInviteAcceptanceCopy,
  demoCompanyInvitePending,
} from "../../../storybook/fixtures/company-invite.fixtures";
import type {
  CompanyMemberInviteAcceptanceCopy,
  CompanyMemberInvitePublicDetails,
} from "../../../contracts/company-invite";
import { CompanyInviteAcceptanceScreen } from "./company-invite-acceptance-screen";

describe("CompanyInviteAcceptanceScreen", () => {
  test("renders only inviter and company details for a pending invite", () => {
    const copy = {
      ...demoCompanyInviteAcceptanceCopy,
      body: "Wenn du annimmst, wird deine Anfrage zur Freigabe gesendet.",
    } as CompanyMemberInviteAcceptanceCopy;
    const invite = {
      companyName: "Smoke Company HQ",
      expiresAt: demoCompanyInvitePending.expiresAt,
      inviterName: "Ayoub Amid",
      status: "pending",
    } as unknown as CompanyMemberInvitePublicDetails;

    render(
      <CompanyInviteAcceptanceScreen
        acceptAction={<button type="button">Accept invite</button>}
        copy={copy}
        invite={invite}
        signedIn={true}
        signInHref="/sign-in"
        signUpHref="/sign-up"
      />,
    );

    expect(
      screen.getByText("Ayoub Amid möchte dich zu Smoke Company HQ einladen."),
    ).toBeTruthy();
    expect(screen.queryByText("employee@example.com")).not.toBeTruthy();
    expect(screen.queryByText("Dana Booker")).not.toBeTruthy();
    expect(screen.queryByText("Booker")).not.toBeTruthy();
    expect(screen.queryByText("HQ Berlin")).not.toBeTruthy();
  });
});
