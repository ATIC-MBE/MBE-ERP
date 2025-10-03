import UserContext from '@/client/context/UserContext'
import { menu_rrhh_master } from '@/client/helpers/constants'
import ContentContainer from '@/components/ContentContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import React, { useContext, useState, useEffect } from 'react'

const ProgresoRrhhMaster = () => {
    const _itemSelected = 'rrhh_master_progreso'
    const { userData } = useContext(UserContext)
    const [employeeData, setEmployeeData] = useState({
        sumaBruto: 0,
        accionesAcumuladas: 0,
        vacacionesTotales: 0,
        vacacionesDisponibles: 0,
        antiguedadAnios: 0,
        antiguedadMeses: 0,
        antiguedadDias: 0,
        fechaInicio: '',
        fechaFin: '',
        porcentajeProgreso: 0,
        tipoJornada: '',
        loading: true,
        error: null
    })

    useEffect(() => {
        fetchEmployeeData()
    }, [userData])

    const fetchEmployeeData = async () => {
        try {
            setEmployeeData(prev => ({ ...prev, loading: true, error: null }))

            const currentUserData = typeof userData === 'function' ? userData() : userData

            let userIdentifier = ''

            if (currentUserData?.nombre_completo) {
                userIdentifier = currentUserData.nombre_completo
            }
            else if (currentUserData?.username) {
                userIdentifier = currentUserData.username
            }
            else if (currentUserData?.id) {
                userIdentifier = currentUserData.id.toString()
            }
            else {
                userIdentifier = 'Usuario RRHH Master'
            }

            const employeeParam = `?employeeId=${encodeURIComponent(userIdentifier)}`

            const response = await fetch(`/api/employee-data${employeeParam}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || 'Error al obtener los datos')
            }

            if (result.success && result.data) {
                setEmployeeData({
                    ...result.data,
                    loading: false,
                    error: null
                })
            } else {
                throw new Error('Formato de respuesta inválido')
            }
        } catch (error) {
            console.error('Error fetching employee data:', error)
            setEmployeeData(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Error al cargar los datos del empleado'
            }))
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount)
    }

    const formatAntiguedad = (anios: number, meses: number, dias: number) => {
        const parts = []

        if (anios > 0) {
            parts.push(`${anios} ${anios === 1 ? 'año' : 'años'}`)
        }

        if (meses > 0) {
            parts.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`)
        }

        if (dias > 0) {
            parts.push(`${dias} ${dias === 1 ? 'día' : 'días'}`)
        }

        if (parts.length === 0) {
            return '0 días'
        }

        if (parts.length === 1) {
            return parts[0]
        } else if (parts.length === 2) {
            return parts.join(' y ')
        } else {
            return parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1]
        }
    }

    const EmployeeMetricCard = ({ title, value, icon, color, subtitle }: {
        title: string, value: string, icon: string, color: string, subtitle?: string
    }) => (
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <div className="text-2xl font-bold mb-1" style={{ color }}>
                        {value}
                    </div>
                    {subtitle && (
                        <p className="text-sm text-gray-600">{subtitle}</p>
                    )}
                </div>
                <div className="text-3xl opacity-60">{icon}</div>
            </div>
        </div>
    )

    const ProgressBar = ({ title, porcentaje, fechaInicio, fechaFin }: {
        title: string, porcentaje: number, fechaInicio: string, fechaFin: string
    }) => {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Inicio: {fechaInicio || 'N/A'}</span>
                        <span className="text-sm text-gray-600">Fin: {fechaFin || 'N/A'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                        <div
                            className="h-6 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center text-white text-sm font-medium"
                            style={{
                                width: `${Math.max(porcentaje, 0)}%`,
                                backgroundColor: porcentaje >= 75 ? '#10B981' : porcentaje >= 50 ? '#F59E0B' : porcentaje >= 25 ? '#F97316' : '#EF4444'
                            }}
                        >
                            {porcentaje > 0 && `${porcentaje}%`}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progreso completado</span>
                        <span className="font-medium text-lg" style={{
                            color: porcentaje >= 75 ? '#10B981' : porcentaje >= 50 ? '#F59E0B' : porcentaje >= 25 ? '#F97316' : '#EF4444'
                        }}>
                            {porcentaje}%
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    if (employeeData.loading) {
        return (
            <Layout>
                <div className="h-100 bg-image p-5 pt-2 flex">
                    <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                    <ContentContainer>
                        <div className="p-6 flex items-center justify-center min-h-96">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Cargando datos del empleado...</p>
                            </div>
                        </div>
                    </ContentContainer>
                </div>
            </Layout>
        )
    }

    if (employeeData.error) {
        return (
            <Layout>
                <div className="h-100 bg-image p-5 pt-2 flex">
                    <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                    <ContentContainer>
                        <div className="p-6">
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-red-400">❌</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{employeeData.error}</p>
                                        <button
                                            onClick={fetchEmployeeData}
                                            className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContentContainer>
                </div>
            </Layout>
        )
    }

    const vacacionesUsadas = employeeData.vacacionesTotales - employeeData.vacacionesDisponibles

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex">
                <MenuLeftContainer data={menu_rrhh_master} itemSelected={_itemSelected} />
                <ContentContainer>
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            <span className="text-2xl mr-2">👤</span>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Mi Progreso Laboral
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <EmployeeMetricCard
                                title="Suma Bruto Acumulada"
                                value={formatCurrency(employeeData.sumaBruto)}
                                icon="💰"
                                color="#10B981"
                                subtitle="Total bruto acumulado"
                            />
                            <EmployeeMetricCard
                                title="Acciones por Mes"
                                value={formatCurrency(employeeData.accionesAcumuladas)}
                                icon="🎯"
                                color="#3B82F6"
                                subtitle="Valor mensual en euros"
                            />
                            <EmployeeMetricCard
                                title="Fecha de Inicio"
                                value={employeeData.fechaInicio || 'N/A'}
                                icon="📅"
                                color="#F97316"
                                subtitle="Inicio en la empresa"
                            />
                            <EmployeeMetricCard
                                title="Antigüedad en la Empresa"
                                value={formatAntiguedad(employeeData.antiguedadAnios, employeeData.antiguedadMeses, employeeData.antiguedadDias)}
                                icon="🏢"
                                color="#8B5CF6"
                                subtitle="Tiempo de servicio"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <ProgressBar
                                title="Progreso de etapa actual"
                                porcentaje={employeeData.porcentajeProgreso}
                                fechaInicio={employeeData.fechaInicio}
                                fechaFin={employeeData.fechaFin}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <EmployeeMetricCard
                                    title="Tipo de Jornada"
                                    value={employeeData.tipoJornada || 'N/A'}
                                    icon="⏰"
                                    color="#EC4899"
                                    subtitle="Modalidad de trabajo"
                                />
                                <EmployeeMetricCard
                                    title="Días Disponibles"
                                    value={employeeData.vacacionesDisponibles.toString()}
                                    icon="🌴"
                                    color="#10B981"
                                    subtitle="Pendientes de usar"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-2">📊</span>
                                Resumen Financiero y Beneficios
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-gray-700">Suma Bruto Total:</span>
                                        <span className="font-semibold text-green-600">
                                            {formatCurrency(employeeData.sumaBruto)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-gray-700">Acciones Acumuladas:</span>
                                        <span className="font-semibold text-blue-600">
                                            {formatCurrency(employeeData.accionesAcumuladas)}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-gray-700">Antigüedad:</span>
                                        <span className="font-semibold text-purple-600">
                                            {formatAntiguedad(employeeData.antiguedadAnios, employeeData.antiguedadMeses, employeeData.antiguedadDias)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <span className="text-gray-700">Vacaciones Disponibles:</span>
                                        <span className="font-semibold text-orange-600">
                                            {employeeData.vacacionesDisponibles} días
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-blue-400">ℹ️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                        Los datos se sincronizan automáticamente desde Google Sheets cada 24 horas.
                                        Si observas alguna discrepancia, contacta con el departamento de RRHH.
                                    </p>
                                    <button
                                        onClick={fetchEmployeeData}
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Actualizar Datos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentContainer>
            </div>
        </Layout>
    )
}

export default ProgresoRrhhMaster