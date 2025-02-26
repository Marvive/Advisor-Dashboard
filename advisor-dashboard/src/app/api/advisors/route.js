import { advisors } from './data';

export async function GET() {
  

  return Response.json(advisors);
}
