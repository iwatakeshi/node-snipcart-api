import merge from 'lodash/merge'
import { Orders } from './orders'
import axios, { AxiosInstance } from 'axios'
import { Customers } from './customers'

export type SnipcartOptions = {
  endpoint: string
  apiKey: string
  timeout: number
}

export class Snipcart {
  private options: Partial<SnipcartOptions>
  private readonly axiosInstance: AxiosInstance
  constructor(options: Partial<SnipcartOptions> = {}) {
    this.options = merge({}, Snipcart.defaultOptions(), options)

    if (!this.options.apiKey) throw new Error('No API key provided.')

    const btoa = (obj: string) => Buffer.from(obj).toString('base64')

    this.axiosInstance = axios.create({
      baseURL: this.options.endpoint,
      timeout: this.options.timeout,
      headers: {
        Authorization: `Bearer ${btoa(this.options.apiKey)}`,
        Accept: 'application/json',
      },
    })
  }

  orders = () => new Orders(this.axiosInstance)
  customers = () => new Customers(this.axiosInstance)

  /**
   * Returns the default configuration for Airtable
   */
  static defaultOptions = (): Partial<SnipcartOptions> => ({
    endpoint: process?.env?.SNIPCART_ENDPOINT || 'https://app.snipcart.com/api',
    apiKey: process?.env?.SNIPCART_API_KEY,
    timeout: 300 * 1000, // 5 minutes
  })
}

export default function snipcart(options: Partial<SnipcartOptions> = {}) {
  return new Snipcart(options)
}
