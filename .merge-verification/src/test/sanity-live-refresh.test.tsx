import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SanityLiveRefresh } from "@/components/SanityLiveRefresh";

const listener = vi.hoisted(() => ({
  next: (_event: { type: string }) => {},
  unsubscribe: vi.fn(),
  listen: vi.fn(),
}));
vi.mock("@/lib/sanity", () => ({ sanityClient: { listen: (...args: unknown[]) => {
  listener.listen(...args);
  return { subscribe: (observer: { next: typeof listener.next }) => { listener.next = observer.next; return { unsubscribe: listener.unsubscribe }; } };
} } }));

afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); });

describe("Sanity live refresh", () => {
  it("debounces published change events and invalidates active queries", async () => {
    vi.useFakeTimers();
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries").mockResolvedValue(undefined);
    const { unmount } = render(<QueryClientProvider client={client}><SanityLiveRefresh /></QueryClientProvider>);
    expect(listener.listen.mock.calls[0][0]).toContain('path("drafts.**")');
    listener.next({ type: "welcome" });
    listener.next({ type: "mutation" });
    listener.next({ type: "mutation" });
    await vi.advanceTimersByTimeAsync(2999);
    expect(invalidate).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(invalidate).toHaveBeenCalledTimes(1);
    unmount();
    expect(listener.unsubscribe).toHaveBeenCalledOnce();
  });
});
