export default function Header({ author }: { author: String }) {
  return (
    <>
      <nav>
        <h1>Selamat datang di Web profile {author ? author : "Anonim"}</h1>
      </nav>
    </>
  )
}