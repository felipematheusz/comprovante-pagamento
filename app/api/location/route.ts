import { NextResponse } from "next/server";
import { getLocationData } from "../../actions/location";

export async function GET() {
  try {
    const locationData = await getLocationData();
    return NextResponse.json(locationData);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao obter localização" },
      { status: 500 }
    );
  }
} 