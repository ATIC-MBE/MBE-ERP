import type { MenuLeftType } from '@/client/types/globalTypes'
import ContentContainer from '@/components/ContentContainer'
import { Layout } from '@/components/Layout'
import MenuLeftContainer from '@/components/MenuLeftContainer'
import UserContext from '@/client/context/UserContext'
import React, { useContext, useEffect, useMemo, useState } from 'react'

const P1NPage = ({
    menu,
    itemSelected,
    title
}: {
    menu: Array<MenuLeftType>
    itemSelected: string
    title: string
}) => {
    const [rows, setRows] = useState<Array<{ id: number; sheetRow: number; dept: string; tipo: string; p1n: string; solucion: string; estado?: string; fecha?: string; autor?: string }>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [deptFilter, setDeptFilter] = useState('')
    const [tipoFilter, setTipoFilter] = useState('')
    const [estadoFilter, setEstadoFilter] = useState('')
    const [autorFilter, setAutorFilter] = useState('')
    const [fechaFrom, setFechaFrom] = useState('')
    const [fechaTo, setFechaTo] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [formData, setFormData] = useState({
        dept: '',
        tipo: '',
        p1n: '',
        solucion: '',
        estado: '',
        fecha: '',
        autor: ''
    })
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editData, setEditData] = useState({
        sheetRow: 0,
        dept: '',
        tipo: '',
        p1n: '',
        solucion: '',
        estado: '',
        fecha: '',
        autor: ''
    })
    const [isWinnerOpen, setIsWinnerOpen] = useState(false)
    const { userData }: any = useContext(UserContext)
    const currentUserData = typeof userData === 'function' ? userData() : userData

    const currentUserName = useMemo(() => {
        if (currentUserData?.nombre_completo) return currentUserData.nombre_completo
        if (currentUserData?.nombre && currentUserData?.apellido) return `${currentUserData.nombre} ${currentUserData.apellido}`.trim()
        if (currentUserData?.nombre) return currentUserData.nombre
        if (currentUserData?.username) return currentUserData.username
        if (currentUserData?.email) return currentUserData.email
        return ''
    }, [currentUserData])

    const loadRows = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch('/api/p1n')
            const data = await response.json()
            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Error cargando P1N')
            }
            setRows(data.rows || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error cargando P1N')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRows()
    }, [])


    const statusStyles: Record<string, string> = {
        Abierto: 'bg-gray-100 text-gray-700 border border-gray-200',
        'En progreso': 'bg-amber-100 text-amber-700 border border-amber-200',
        Resuelto: 'bg-green-100 text-green-700 border border-green-200',
        'Sin estado': 'bg-gray-100 text-gray-600 border border-gray-200'
    }

    const getRowStyle = (estado?: string) => {
        if (estado === 'En progreso') return { backgroundColor: '#fff7ed' }
        if (estado === 'Resuelto') return { backgroundColor: '#dcfce7' }
        return {}
    }

    const formatDate = (value?: string) => {
        if (!value) return '-'
        const [year, month, day] = value.split('-')
        if (!year || !month || !day) return value
        return `${day}/${month}/${year}`
    }

    const getWeekStartMonday = (date: Date) => {
        const base = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const day = base.getDay()
        const diff = (day === 0 ? -6 : 1) - day
        base.setDate(base.getDate() + diff)
        return base
    }

    const formatDateRangeLabel = (start: Date, end: Date) => {
        const startLabel = formatDate(start.toISOString().slice(0, 10))
        const endLabel = formatDate(end.toISOString().slice(0, 10))
        return `${startLabel} - ${endLabel}`
    }

    const weeklyWinner = useMemo(() => {
        const today = new Date()
        const currentWeekStart = getWeekStartMonday(today)
        const prevWeekStart = new Date(currentWeekStart)
        prevWeekStart.setDate(prevWeekStart.getDate() - 7)
        const prevWeekEnd = new Date(prevWeekStart)
        prevWeekEnd.setDate(prevWeekEnd.getDate() + 6)

        const counts: Record<string, number> = {}

        rows.forEach((row) => {
            if (!row.fecha || !row.autor) return
            const rowDate = new Date(`${row.fecha}T00:00:00`)
            if (rowDate >= prevWeekStart && rowDate <= prevWeekEnd) {
                counts[row.autor] = (counts[row.autor] || 0) + 1
            }
        })

        const entries = Object.entries(counts)
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1]
                return a[0].localeCompare(b[0])
            })

        const winner = entries.length > 0 ? entries[0] : null
        return {
            weekStart: prevWeekStart,
            weekEnd: prevWeekEnd,
            entries,
            winner
        }
    }, [rows])

    useEffect(() => {
        if (!weeklyWinner.winner) return
        const today = new Date()
        const isMonday = today.getDay() === 1
        if (!isMonday) return
        const weekKey = weeklyWinner.weekStart.toISOString().slice(0, 10)
        const storageKey = `p1n_winner_shown_${weekKey}`
        if (typeof window === 'undefined') return
        if (localStorage.getItem(storageKey)) return
        localStorage.setItem(storageKey, '1')
        setIsWinnerOpen(true)
    }, [weeklyWinner])


    const filteredRows = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase()
        return rows.filter((row) => {
            const rowAutor = row.autor || ''
            const matchesQuery = !normalizedQuery ||
                row.p1n.toLowerCase().includes(normalizedQuery) ||
                row.solucion.toLowerCase().includes(normalizedQuery)
            const matchesDept = !deptFilter || row.dept === deptFilter
            const matchesTipo = !tipoFilter || row.tipo === tipoFilter
            const rowEstado = row.estado || 'Sin estado'
            const matchesEstado = !estadoFilter || rowEstado === estadoFilter
            const matchesAutor = !autorFilter || rowAutor === autorFilter

            let matchesFecha = true
            if (fechaFrom || fechaTo) {
                if (!row.fecha) {
                    matchesFecha = false
                } else {
                    const rowDate = new Date(`${row.fecha}T00:00:00`)
                    if (fechaFrom) {
                        const fromDate = new Date(`${fechaFrom}T00:00:00`)
                        if (rowDate < fromDate) matchesFecha = false
                    }
                    if (fechaTo) {
                        const toDate = new Date(`${fechaTo}T23:59:59`)
                        if (rowDate > toDate) matchesFecha = false
                    }
                }
            }

            return matchesQuery && matchesDept && matchesTipo && matchesEstado && matchesAutor && matchesFecha
        })
    }, [rows, query, deptFilter, tipoFilter, estadoFilter, autorFilter, fechaFrom, fechaTo])

    const authorOptions = useMemo(() => {
        const unique = new Set<string>()
        rows.forEach((row) => {
            if (row.autor) unique.add(row.autor)
        })
        return Array.from(unique).sort((a, b) => a.localeCompare(b))
    }, [rows])

    const countByStatus = (status: string) =>
        rows.filter((row) => (row.estado || 'Sin estado') === status).length

    const handleFormChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFormReset = () => {
        setFormData({
            dept: '',
            tipo: '',
            p1n: '',
            solucion: '',
            estado: '',
            fecha: '',
            autor: ''
        })
    }

    const handleEditChange = (field: keyof typeof editData, value: string | number) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            setSaveError(null)
            const response = await fetch('/api/p1n', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dept: formData.dept,
                    tipo: formData.tipo,
                    p1n: formData.p1n,
                    solucion: formData.solucion,
                    estado: formData.estado,
                    fecha: formData.fecha,
                    autor: formData.autor
                })
            })
            const data = await response.json()
            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'No se pudo guardar el P1N')
            }
            setRows(data.rows || [])
            setIsCreateOpen(false)
            handleFormReset()
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'No se pudo guardar el P1N')
        } finally {
            setIsSaving(false)
        }
    }

    const handleEditSave = async () => {
        try {
            setIsSaving(true)
            setSaveError(null)
            const response = await fetch('/api/p1n', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sheetRow: editData.sheetRow,
                    dept: editData.dept,
                    tipo: editData.tipo,
                    p1n: editData.p1n,
                    solucion: editData.solucion,
                    estado: editData.estado,
                    fecha: editData.fecha,
                    autor: editData.autor
                })
            })
            const data = await response.json()
            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'No se pudo actualizar el P1N')
            }
            setRows(data.rows || [])
            setIsEditOpen(false)
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'No se pudo actualizar el P1N')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Layout>
            <div className="h-100 bg-image p-5 pt-2 flex">
                <MenuLeftContainer data={menu} itemSelected={itemSelected} />
                <ContentContainer>
                    <div className="p-6">
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                                    <p className="text-gray-600 mt-2">Datos en vivo desde Google Sheets.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const today = new Date().toISOString().slice(0, 10)
                                            setFormData((prev) => ({
                                                ...prev,
                                                fecha: prev.fecha || today,
                                                autor: prev.autor || currentUserName
                                            }))
                                            setIsCreateOpen(true)
                                        }}
                                        className="bg-[#005360] text-white px-4 py-2 rounded-lg shadow hover:bg-[#00444c] transition-colors"
                                    >
                                        Nuevo P1N
                                    </button>
                                    <button
                                        onClick={() => setIsWinnerOpen(true)}
                                        className="bg-white text-[#005360] px-4 py-2 rounded-lg border border-[#005360] shadow hover:bg-[#e6f3f6] transition-colors"
                                    >
                                        Ver ganador P1N
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                    <p className="text-xs uppercase text-gray-500">Total</p>
                                    <p className="text-2xl font-bold text-gray-800">{rows.length}</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                    <p className="text-xs uppercase text-gray-500">Abiertos</p>
                                    <p className="text-2xl font-bold text-red-600">{countByStatus('Abierto')}</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                    <p className="text-xs uppercase text-gray-500">En progreso</p>
                                    <p className="text-2xl font-bold text-amber-600">{countByStatus('En progreso')}</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                    <p className="text-xs uppercase text-gray-500">Resueltos</p>
                                    <p className="text-2xl font-bold text-green-600">{countByStatus('Resuelto')}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Buscar en P1N o solucion"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005360]"
                                    />
                                    <select
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        value={deptFilter}
                                        onChange={(event) => setDeptFilter(event.target.value)}
                                    >
                                        <option value="">Departamento</option>
                                        <option value="RRHH">RRHH</option>
                                        <option value="MYD">MYD</option>
                                        <option value="ATIC">ATIC</option>
                                        <option value="ACA">ACA</option>
                                        <option value="ADE">ADE</option>
                                    </select>
                                    <select
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        value={tipoFilter}
                                        onChange={(event) => setTipoFilter(event.target.value)}
                                    >
                                        <option value="">Tipo</option>
                                        <option value="Dejadez">Dejadez</option>
                                        <option value="Procedimiento">Procedimiento</option>
                                    </select>
                                    <select
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        value={estadoFilter}
                                        onChange={(event) => setEstadoFilter(event.target.value)}
                                    >
                                        <option value="">Estado</option>
                                        <option value="Abierto">Abierto</option>
                                        <option value="En progreso">En progreso</option>
                                        <option value="Resuelto">Resuelto</option>
                                        <option value="Sin estado">Sin estado</option>
                                    </select>
                                    <select
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        value={autorFilter}
                                        onChange={(event) => setAutorFilter(event.target.value)}
                                    >
                                        <option value="">Autor</option>
                                        {authorOptions.map((autor) => (
                                            <option key={autor} value={autor}>{autor}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        value={fechaFrom}
                                        onChange={(event) => setFechaFrom(event.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={fechaTo}
                                        onChange={(event) => setFechaTo(event.target.value)}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            {loading ? (
                                <div className="p-6 text-gray-600">Cargando P1N...</div>
                            ) : error ? (
                                <div className="p-6 text-red-600">{error}</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr>
                                                <th className="text-left px-4 py-3 font-semibold">Dept</th>
                                                <th className="text-left px-2 py-3 font-semibold w-[7rem]">Tipo</th>
                                                <th className="text-left px-3 py-3 font-semibold">P1N</th>
                                                <th className="text-left px-4 py-3 font-semibold">Solucion</th>
                                                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                                                <th className="text-left px-4 py-3 font-semibold">Autor</th>
                                                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                                                <th className="text-left px-4 py-3 font-semibold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredRows.map((row) => {
                                                const rowEstado = row.estado || ''
                                                const rowStyle = getRowStyle(row.estado)
                                                return (
                                                    <tr key={row.id} className="hover:bg-gray-50" style={rowStyle}>
                                                        <td className="px-4 py-3 font-medium text-gray-800">{row.dept}</td>
                                                        <td className="px-2 py-3 text-gray-700 w-[7rem]">{row.tipo}</td>
                                                        <td className="px-3 py-3 text-gray-700 max-w-[16rem]">
                                                            <div className="line-clamp-2">{row.p1n}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-700 max-w-[18rem]">
                                                            <div className="line-clamp-2">{row.solucion}</div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {rowEstado ? (
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[rowEstado] || statusStyles['Sin estado']}`}>
                                                                    {rowEstado}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600">{row.autor || '-'}</td>
                                                        <td className="px-4 py-3 text-gray-600">{formatDate(row.fecha)}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => {
                                                                    setSaveError(null)
                                                                    setEditData({
                                                                        sheetRow: row.sheetRow,
                                                                        dept: row.dept || '',
                                                                        tipo: row.tipo || '',
                                                                        p1n: row.p1n || '',
                                                                        solucion: row.solucion || '',
                                                                        estado: row.estado || '',
                                                                        fecha: row.fecha || '',
                                                                        autor: row.autor || currentUserName
                                                                    })
                                                                    setIsEditOpen(true)
                                                                }}
                                                                className="icon-btn text-white"
                                                                title="Editar"
                                                            >
                                                                ✎
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </ContentContainer>
            </div>

            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">Nuevo P1N</h2>
                            <button
                                onClick={() => {
                                    setIsCreateOpen(false)
                                    handleFormReset()
                                }}
                                className="icon-btn text-white"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Departamento</label>
                                    <select
                                        value={formData.dept}
                                        onChange={(event) => handleFormChange('dept', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="RRHH">RRHH</option>
                                        <option value="MYD">MYD</option>
                                        <option value="ATIC">ATIC</option>
                                        <option value="ACA">ACA</option>
                                        <option value="ADE">ADE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Tipo</label>
                                    <select
                                        value={formData.tipo}
                                        onChange={(event) => handleFormChange('tipo', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Dejadez">Dejadez</option>
                                        <option value="Procedimiento">Procedimiento</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase text-gray-500">P1N</label>
                                <textarea
                                    value={formData.p1n}
                                    onChange={(event) => handleFormChange('p1n', event.target.value)}
                                    rows={2}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Describe el P1N"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase text-gray-500">Solucion</label>
                                <textarea
                                    value={formData.solucion}
                                    onChange={(event) => handleFormChange('solucion', event.target.value)}
                                    rows={2}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Propuesta de solucion"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={(event) => handleFormChange('estado', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Abierto">Abierto</option>
                                        <option value="En progreso">En progreso</option>
                                        <option value="Resuelto">Resuelto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Fecha</label>
                                    <input
                                        type="date"
                                        value={formData.fecha}
                                        onChange={(event) => handleFormChange('fecha', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500">Autor</label>
                                <input
                                    type="text"
                                    value={formData.autor}
                                    onChange={(event) => handleFormChange('autor', event.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Nombre del autor"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                            {saveError ? (
                                <p className="text-sm text-red-600">{saveError}</p>
                            ) : (
                                <span />
                            )}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleFormReset()}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Limpiar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-[#005360] text-white px-4 py-2 rounded-lg shadow hover:bg-[#00444c] transition-colors"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">Editar P1N</h2>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="icon-btn text-white"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Departamento</label>
                                    <select
                                        value={editData.dept}
                                        onChange={(event) => handleEditChange('dept', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="RRHH">RRHH</option>
                                        <option value="MYD">MYD</option>
                                        <option value="ATIC">ATIC</option>
                                        <option value="ACA">ACA</option>
                                        <option value="ADE">ADE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Tipo</label>
                                    <select
                                        value={editData.tipo}
                                        onChange={(event) => handleEditChange('tipo', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Dejadez">Dejadez</option>
                                        <option value="Procedimiento">Procedimiento</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase text-gray-500">P1N</label>
                                <textarea
                                    value={editData.p1n}
                                    onChange={(event) => handleEditChange('p1n', event.target.value)}
                                    rows={2}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase text-gray-500">Solucion</label>
                                <textarea
                                    value={editData.solucion}
                                    onChange={(event) => handleEditChange('solucion', event.target.value)}
                                    rows={2}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Estado</label>
                                    <select
                                        value={editData.estado}
                                        onChange={(event) => handleEditChange('estado', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Abierto">Abierto</option>
                                        <option value="En progreso">En progreso</option>
                                        <option value="Resuelto">Resuelto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-500">Fecha</label>
                                    <input
                                        type="date"
                                        value={editData.fecha}
                                        onChange={(event) => handleEditChange('fecha', event.target.value)}
                                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase text-gray-500">Autor</label>
                                <input
                                    type="text"
                                    value={editData.autor}
                                    onChange={(event) => handleEditChange('autor', event.target.value)}
                                    className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                            {saveError ? (
                                <p className="text-sm text-red-600">{saveError}</p>
                            ) : (
                                <span />
                            )}
                            <button
                                onClick={handleEditSave}
                                className="bg-[#005360] text-white px-4 py-2 rounded-lg shadow hover:bg-[#00444c] transition-colors"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isWinnerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">Ganador P1N semanal</h2>
                            <button
                                onClick={() => setIsWinnerOpen(false)}
                                className="icon-btn text-white"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="text-sm text-gray-600">
                                Semana: {formatDateRangeLabel(weeklyWinner.weekStart, weeklyWinner.weekEnd)}
                            </div>
                            {weeklyWinner.winner ? (
                                <div className="bg-[#f0fbff] border border-[#bfe7f2] rounded-lg p-4">
                                    <p className="text-xs uppercase text-[#005360]">Ganador</p>
                                    <p className="text-xl font-semibold text-[#005360]">
                                        {weeklyWinner.winner[0]}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        P1N registrados: {weeklyWinner.winner[1]}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600">No hay P1N en la semana anterior.</div>
                            )}

                            {weeklyWinner.entries.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-100">
                                    <div className="px-4 py-2 text-xs uppercase text-gray-500">Ranking</div>
                                    <div className="divide-y divide-gray-100">
                                        {weeklyWinner.entries.slice(0, 5).map(([autor, total]) => (
                                            <div key={autor} className="flex items-center justify-between px-4 py-2 text-sm">
                                                <span className="text-gray-700">{autor}</span>
                                                <span className="text-gray-500">{total}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end border-t border-gray-100 px-6 py-3">
                            <button
                                onClick={() => setIsWinnerOpen(false)}
                                className="bg-[#005360] text-white px-4 py-2 rounded-lg shadow hover:bg-[#00444c] transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default P1NPage
