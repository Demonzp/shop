export async function POST(request: Request) {

    const user = await request.json();
    console.log('user = ', user);
    return Response.json({message: 'success'});
}