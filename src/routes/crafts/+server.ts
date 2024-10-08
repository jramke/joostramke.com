export const prerender = true;

export async function GET() {
    return Response.redirect('https://crafts.joostramke.com', 301);
}