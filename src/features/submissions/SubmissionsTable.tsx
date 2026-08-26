import type { Submission } from './submission.types'

type SubmissionsTableProps = {
  submissions: Submission[]
  onEdit: (submission: Submission) => void
  onDelete: (submission: Submission) => void
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      <path
        d="m4 20 4.2-.9L18.7 8.6a2.1 2.1 0 0 0 0-3l-.3-.3a2.1 2.1 0 0 0-3 0L4.9 15.8 4 20Zm10-13 3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      <path
        d="M5 7h14m-9-3h4m-7 3 .7 13h8.6L17 7M10 11v5m4-5v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChristianStatus({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex border px-2.5 py-1 text-xs font-medium ${
        value
          ? 'border-[#5d8f50]/60 text-[#8fc27f]'
          : 'border-[#a84d45]/60 text-[#e27e72]'
      }`}
    >
      {value ? 'Sim' : 'Não'}
    </span>
  )
}

function OriginStatus({ submission }: { submission: Submission }) {
  const label =
    submission.origin === 'conference'
      ? submission.conferenceSlug === 'sobretodaacarne'
        ? 'Sobre Toda a Carne'
        : 'Conferência'
      : submission.origin === 'participation'
        ? 'Participar'
        : 'Manual'

  return (
    <span className="inline-flex border border-fire/25 px-2.5 py-1 text-xs font-medium text-fire/80">
      {label}
    </span>
  )
}

function RowActions({
  submission,
  onEdit,
  onDelete,
}: {
  submission: Submission
  onEdit: (submission: Submission) => void
  onDelete: (submission: Submission) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="grid size-9 place-items-center border border-fire/45 text-fire transition-colors hover:bg-fire hover:text-[#17110f]"
        onClick={() => onEdit(submission)}
        aria-label={`Editar ${submission.name}`}
      >
        <EditIcon />
      </button>
      <button
        type="button"
        className="grid size-9 place-items-center border border-cream/15 text-cream/55 transition-colors hover:border-[#e27e72] hover:text-[#e27e72]"
        onClick={() => onDelete(submission)}
        aria-label={`Excluir ${submission.name}`}
      >
        <DeleteIcon />
      </button>
    </div>
  )
}

function SubmissionsTable({
  submissions,
  onEdit,
  onDelete,
}: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="border-y border-cream/10 py-20 text-center font-sans">
        <p className="text-xl font-medium text-cream">Nenhum cadastro encontrado.</p>
        <p className="mt-2 text-sm font-light text-cream/45">
          Ajuste a busca ou selecione outro filtro.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-x-auto border border-cream/12 md:block">
        <table className="w-full border-collapse font-sans">
          <thead>
            <tr className="border-b border-cream/12 bg-cream/[0.025] text-left text-xs font-medium text-cream/50">
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Telefone</th>
              <th className="px-6 py-4">Cristão(ã)</th>
              <th className="px-6 py-4">Origem</th>
              <th className="px-6 py-4">Enviado em</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className="border-b border-cream/10 text-sm text-cream/80 transition-colors last:border-b-0 hover:bg-fire/[0.055]"
              >
                <td className="px-6 py-4 font-medium text-cream">{submission.name}</td>
                <td className="px-6 py-4">{submission.phone}</td>
                <td className="px-6 py-4">
                  <ChristianStatus value={submission.isChristian} />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <OriginStatus submission={submission} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-cream/55">
                  {dateFormatter.format(new Date(submission.createdAt))}
                </td>
                <td className="px-6 py-4">
                  <RowActions
                    submission={submission}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-cream/10 border-y border-cream/10 md:hidden">
        {submissions.map((submission) => (
          <article key={submission.id} className="py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-base font-medium text-cream">
                  {submission.name}
                </h3>
                <p className="mt-1 font-sans text-sm text-cream/55">
                  {submission.phone}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <ChristianStatus value={submission.isChristian} />
                <OriginStatus submission={submission} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <time className="font-sans text-xs text-cream/35">
                {dateFormatter.format(new Date(submission.createdAt))}
              </time>
              <RowActions
                submission={submission}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default SubmissionsTable
