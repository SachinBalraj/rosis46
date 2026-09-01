const MESSAGE = "🚚 SPECIAL OFFER: GET FREE SHIPPING ON ORDERS ABOVE ₹3,000";

const MessageSpan = () => (
  <span className="pr-16 text-sm font-bold tracking-wide text-white whitespace-nowrap">
    {MESSAGE}
  </span>
);

export function AnnouncementBar() {
  return (
    <div className="w-full overflow-hidden border-t-4 border-yellow-500 bg-[#0a1128] py-2.5">
      <div className="flex w-max whitespace-nowrap">
        <div className="animate-marquee flex items-center">
          <MessageSpan />
          <MessageSpan />
        </div>
        <div className="animate-marquee flex items-center">
          <MessageSpan />
          <MessageSpan />
        </div>
      </div>
    </div>
  );
}
