import { path, PathList, rolenum } from '@/client/types/globalTypes'

let test:rolenum = ''

export const PATH: PathList = {
    '/': new path('oficina', 'superadmin'),
    '/rrhh': new path('rrhh','admin','superadmin'),
    '/admin': new path('admin', 'superadmin'),
    '/superadmin': new path('superadmin'),
    '/propietario': new path('propietario'),
    '/dn':new path('dn','superadmin'),
    '/ceo':new path('ceo'),
    '/dnmaster':new path('dnmaster'),
    '/myd':new path('myd'),
    '/da': new path('da'),
    '/aca': new path('aca'),
    '/ade': new path('ade'),
    '/colaborador': new path('colaborador'),
    'acamaster': new path('acamaster'),
    'aticmaster': new path('aticmaster'),
    'mydmaster': new path('mydmaster'),
    'damaster': new path('damaster'),
    'ademaster': new path('ademaster')
}