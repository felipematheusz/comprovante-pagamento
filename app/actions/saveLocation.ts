'use server'

import { prisma } from '../services/prisma'
import { LocationData } from './location'

export async function saveLocationToDB(location: LocationData) {
  try {
    const savedLocation = await prisma.location.create({
      data: {
        ip: location.ip,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        region: location.region,
        country: location.country,
      },
    })
    return savedLocation
  } catch (error) {
    console.error('Erro ao salvar localização:', error)
    throw new Error('Falha ao salvar localização no banco de dados')
  }
}

export async function getLocationsFromDB() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    })
    return locations
  } catch (error) {
    console.error('Erro ao buscar localizações:', error)
    throw new Error('Falha ao buscar localizações do banco de dados')
  }
} 