// Intercepting route - hiện như popup khi bấm từ danh sách
// Pattern (.)[slug] intercept requests from /components/[category]/[slug]
export default function ModalSlugPage() {
  return (
    <div>
      <h1>Modal (Intercepted)</h1>
    </div>
  );
}
