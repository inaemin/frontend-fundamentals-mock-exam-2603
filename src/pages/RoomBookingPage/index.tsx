import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Top, Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations } from 'pages/remotes';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT, TIME_SLOTS, ROUTES } from 'pages/constants';
import { DateInput } from 'pages/common/DateInput';
import { PageSection } from 'pages/common/PageSection';
import { SectionDivider } from 'pages/common/SectionDivider';
import { MESSAGE_TYPE } from 'pages/types';
import { useNavigateWithMessage, useBookingForm, useBookingSubmit } from './hooks';
import { ErrorBanner } from './components/ErrorBanner';
import { FormField } from './components/FormField';
import { FieldSelect } from './components/FieldSelect';
import { NumberInput } from './components/NumberInput';
import { ToggleChip } from './components/ToggleChip';
import { ValidationError } from './components/ValidationError';
import { RoomList, EmptyRoomList } from './components/RoomList';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const navigateWithMessage = useNavigateWithMessage();
  const { form, setField, validationError, isFormComplete, getAvailableRooms } = useBookingForm();
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = form;

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
  const { data: reservations = [] } = useQuery({
    queryKey: ['reservations', date],
    queryFn: () => getReservations(date),
    enabled: !!date,
  });

  const { submit, isLoading } = useBookingSubmit(form, {
    onSuccess: () => navigateWithMessage(ROUTES.HOME, { type: MESSAGE_TYPE.SUCCESS, text: '예약이 완료되었습니다!' }),
    onError: message => {
      setErrorMessage(message);
      setSelectedRoomId(null);
    },
  });

  const handleFieldChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setField(field, value);
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);
  const availableRooms = getAvailableRooms(rooms, reservations);

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && <ErrorBanner message={errorMessage} />}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <PageSection title="예약 조건">
        {/* 날짜 */}
        <FormField label="날짜">
          <DateInput value={date} onChange={value => handleFieldChange('date', value)} />
        </FormField>
        <Spacing size={14} />

        {/* 시간 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <FormField label="시작 시간" flex>
            <FieldSelect
              value={startTime}
              onChange={value => handleFieldChange('startTime', value)}
              options={TIME_SLOTS.slice(0, -1).map(t => ({ value: t, label: t }))}
              aria-label="시작 시간"
            />
          </FormField>
          <FormField label="종료 시간" flex>
            <FieldSelect
              value={endTime}
              onChange={value => handleFieldChange('endTime', value)}
              options={TIME_SLOTS.slice(1).map(t => ({ value: t, label: t }))}
              aria-label="종료 시간"
            />
          </FormField>
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <FormField label="참석 인원" flex>
            <NumberInput
              value={attendees}
              onChange={value => handleFieldChange('attendees', value)}
              min={1}
              aria-label="참석 인원"
            />
          </FormField>
          <FormField label="선호 층" flex>
            <FieldSelect
              value={preferredFloor?.toString() ?? ''}
              onChange={value => handleFieldChange('preferredFloor', value === '' ? null : Number(value))}
              options={floors.map((f: number) => ({ value: String(f), label: `${f}층` }))}
              placeholder="전체"
              aria-label="선호 층"
            />
          </FormField>
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <FormField label="필요 장비" spacing={8}>
          <div
            css={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            `}
          >
            {ALL_EQUIPMENT.map(eq => (
              <ToggleChip
                key={eq}
                label={EQUIPMENT_LABELS[eq]}
                selected={equipment.includes(eq)}
                onClick={() => {
                  const next = equipment.includes(eq) ? equipment.filter(e => e !== eq) : [...equipment, eq];
                  handleFieldChange('equipment', next);
                }}
              />
            ))}
          </div>
        </FormField>
      </PageSection>

      {validationError && <ValidationError message={validationError} />}

      <SectionDivider />

      {/* 예약 가능 회의실 목록 */}
      {isFormComplete && (
        <PageSection
          title={
            <>
              <Text typography="t5" fontWeight="bold" color={colors.grey900}>
                예약 가능 회의실
              </Text>
              <Text typography="t7" fontWeight="medium" color={colors.grey500}>
                {availableRooms.length}개
              </Text>
            </>
          }
        >
          {availableRooms.length === 0 ? (
            <EmptyRoomList />
          ) : (
            <RoomList rooms={availableRooms} selectedRoomId={selectedRoomId} onSelect={setSelectedRoomId} />
          )}

          <Spacing size={16} />
          <Button display="full" onClick={() => submit(selectedRoomId)} disabled={isLoading}>
            {isLoading ? '예약 중...' : '확정'}
          </Button>
        </PageSection>
      )}

      <Spacing size={24} />
    </div>
  );
}
