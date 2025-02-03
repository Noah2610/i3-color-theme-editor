import page from "../public/index.html";

const { url } = Bun.serve({
    static: {
        "/": page,
    },

    fetch(_req) {
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Server running on ${url}`);
