export interface Flight {
    id: string;
    pk: string;
    sk: string;
    origin: string;
    destination: string;
    departureDate: number;
    passengers: Passenger[];
}

export interface getFlightsResponse {
    id: string;
    pk: string;
    sk: string;
    origin: string;
    destination: string;
    departureDate: number;
    passengers: Passenger[];
}

export type Passenger = any;

export interface PostFlightBody {
    passengers: Passenger[];
    flightTime: string;
    bookingName?: string;
}
