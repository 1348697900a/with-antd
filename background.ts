export {}

console.log(
  "Live now; ??make now always the most precious time. Now will never come again."
)
console.log("service-worker")
fetch("http://localhost:3000/aa")
  .then((res) => res.json())
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
console.log("fetch!22")
