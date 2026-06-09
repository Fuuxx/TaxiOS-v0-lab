import { Bell, MessageSquare, Phone, Send } from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderInboxPayload,
  RiderNotification,
} from "../../../contracts/rider-app";
import { workspaceChipClassForTone } from "../workspace/workspace-status";
import { RiderActionButton, RiderSection } from "./rider-primitives";

/* =====================================================================
 * Rider — Postfach
 *
 * Combines the live driver chat (only present while a ride is active)
 * with ride notifications. The message composer and call controls are
 * rendered from `liveChat.allowedActions`; the UI never enables them
 * based on status alone.
 *
 * How to wire with tRPC:
 *   const { data, isLoading, error } = trpc.rider.inbox.useQuery()
 *   const send = trpc.rider.inbox.sendMessage.useMutation()
 *   <RiderInboxScreen payload={data} copy={copy}
 *     onSendMessage={(text) => send.mutate({ tripId, text })} />
 * ===================================================================== */

const notificationToneMap = {
  attention: "attention",
  info: "info",
  neutral: "neutral",
  success: "success",
} as const;

export function RiderInboxScreen({
  onAction,
  payload,
}: {
  copy?: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  onSendMessage?: (text: string) => void;
  payload: RiderInboxPayload;
}) {
  const chat = payload.liveChat;
  const callAction = chat?.allowedActions.find((action) => action.id === "call_driver");
  const messageAction = chat?.allowedActions.find(
    (action) => action.id === "message_driver",
  );

  return (
    <div className="space-y-6 pb-4">
      {chat ? (
        <RiderSection title="Aktive Fahrt">
          <div className="taxis-rider-card overflow-hidden">
            <div className="flex items-center gap-3 border-[var(--taxis-workspace-divider)] border-b p-4">
              <span className="taxis-rider-avatar" aria-hidden="true">
                {chat.driver.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                  {chat.driver.name}
                </p>
                <p className="truncate text-[12px] text-[var(--taxis-workspace-text-muted)]">
                  {chat.routeLabel}
                </p>
              </div>
              {callAction ? (
                <RiderActionButton
                  action={callAction}
                  icon={<Phone size={15} strokeWidth={2} />}
                  onAction={onAction}
                  variant="secondary"
                />
              ) : null}
            </div>

            <div className="space-y-3 p-4">
              {chat.messages.map((message) => (
                <div
                  key={message.id}
                  className="flex flex-col"
                  data-from-rider={message.fromRider}
                  style={{ alignItems: message.fromRider ? "flex-end" : "flex-start" }}
                >
                  <span
                    className="taxis-rider-bubble"
                    data-from-rider={message.fromRider}
                  >
                    {message.body}
                  </span>
                  <span className="mt-1 px-1 text-[11px] text-[var(--taxis-workspace-text-subtle)] tabular-nums">
                    {message.timeLabel}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-[var(--taxis-workspace-divider)] border-t p-3">
              <div
                className="taxis-rider-input-wrap"
                data-disabled={messageAction?.disabled === true}
              >
                <input
                  className="taxis-rider-input"
                  disabled={messageAction?.disabled === true}
                  placeholder={chat.inputPlaceholder}
                  readOnly
                  type="text"
                />
                <button
                  aria-label="Nachricht senden"
                  className="taxis-rider-send"
                  disabled={messageAction?.disabled === true}
                  onClick={() => {
                    if (messageAction && messageAction.disabled !== true) {
                      onAction?.(messageAction);
                    }
                  }}
                  type="button"
                >
                  <Send size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </RiderSection>
      ) : (
        <RiderSection title="Aktive Fahrt">
          <div className="taxis-rider-card flex flex-col items-center gap-2 p-6 text-center">
            <MessageSquare
              aria-hidden="true"
              className="text-[var(--taxis-workspace-text-subtle)]"
              size={24}
            />
            <p className="text-[13px] text-[var(--taxis-workspace-text-muted)]">
              Kein aktiver Chat. Sobald eine Fahrt läuft, kannst du hier mit der
              Fahrerin oder dem Fahrer schreiben.
            </p>
          </div>
        </RiderSection>
      )}

      <RiderSection title="Mitteilungen">
        {payload.notifications.length === 0 ? (
          <div className="taxis-rider-card flex flex-col items-center gap-2 p-6 text-center">
            <Bell
              aria-hidden="true"
              className="text-[var(--taxis-workspace-text-subtle)]"
              size={24}
            />
            <p className="text-[13px] text-[var(--taxis-workspace-text-muted)]">
              Keine neuen Mitteilungen.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {payload.notifications.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </ul>
        )}
      </RiderSection>
    </div>
  );
}

function NotificationRow({ notification }: { notification: RiderNotification }) {
  return (
    <li className="taxis-rider-card flex items-start gap-3 p-4" data-unread={notification.unread}>
      {notification.unread ? (
        <span className="taxis-rider-unread-dot">
          <span className="sr-only">Ungelesen</span>
        </span>
      ) : (
        <span className="taxis-rider-unread-dot taxis-rider-unread-dot-read" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
            {notification.title}
          </p>
          <span className="shrink-0 text-[11px] text-[var(--taxis-workspace-text-subtle)] tabular-nums">
            {notification.timeLabel}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[var(--taxis-workspace-text-muted)] leading-relaxed">
          {notification.body}
        </p>
        <span className={`mt-2 ${workspaceChipClassForTone(notificationToneMap[notification.tone])}`}>
          {labelForTone(notification.tone)}
        </span>
      </div>
    </li>
  );
}

function labelForTone(tone: RiderNotification["tone"]): string {
  switch (tone) {
    case "attention":
      return "Aktion erforderlich";
    case "info":
      return "Info";
    case "success":
      return "Bestätigt";
    default:
      return "Hinweis";
  }
}
