import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'html-entities';
import ListRow from '@/components/ui/ListRow';
import { EmptyView, ErrorView, LoadingView } from '@/components/ui/StateView';
import { useThemeColors } from '@/hooks/use-theme-colors';
import URLs from '../../../constants/URLs';
import { fetchJson } from '../../../services/http';
import { EventDates, formatDate, formatEventTimeRange, todayStart } from '../../../utils/eventUtils';

interface Category {
  id: string;
  name: string;
  parent: string;
  type: 'category';
}

interface AgendaEvent extends EventDates {
  id: string;
  title: string;
  categories: { id: string }[];
  type: 'event';
}

type Row = Category | AgendaEvent;

export default function AgendaScreen() {
  const { agendaId, title } = useLocalSearchParams<{ agendaId: string; title: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: title ?? 'Kalender' });
  }, [navigation, title]);

  return <CombinedList parentId={agendaId ?? '0'} />;
}

function CombinedList({ parentId }: { parentId: string }) {
  const colors = useThemeColors();

  const categories = useQuery({
    queryKey: ['categories', { parentId }],
    queryFn: () =>
      fetchJson<{ categories?: Category[] }>(
        `${URLs.AGENDA_BASE_URL}categories/?hide_empty=false&orderby=parent&per_page=10000`
      ),
  });

  const startDate = todayStart();
  // Im Root (parentId 0) lehnt die API `categories=0` mit 400 ab, dort gibt es nur Ordner.
  const events = useQuery({
    enabled: parentId !== '0',
    queryKey: ['events', { parentId }],
    queryFn: () =>
      fetchJson<{ events?: AgendaEvent[] }>(
        `${URLs.AGENDA_BASE_URL}events?start_date=${encodeURIComponent(startDate)}&categories=${parentId}&per_page=10000`
      ),
  });

  if (categories.isPending || (events.isPending && events.fetchStatus !== 'idle')) return <LoadingView />;

  const failed = categories.error ?? events.error;
  if (failed) {
    return (
      <ErrorView
        message={failed.message}
        onRetry={() => {
          categories.refetch();
          events.refetch();
        }}
      />
    );
  }

  const rows: Row[] = [
    ...(categories.data?.categories ?? [])
      .filter((category) => String(category.parent) === parentId)
      .map((category): Category => ({ ...category, type: 'category' })),
    ...(events.data?.events ?? [])
      .filter((event) => event.categories.some((cat) => String(cat.id) === parentId))
      .map((event): AgendaEvent => ({ ...event, type: 'event' })),
  ];

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={rows}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      refreshing={categories.isRefetching || events.isRefetching}
      onRefresh={() => {
        categories.refetch();
        events.refetch();
      }}
      ListEmptyComponent={<EmptyView message="Keine Einträge vorhanden." />}
      renderItem={({ item }) =>
        item.type === 'category' ? (
          <ListRow
            title={decode(item.name)}
            left={<Ionicons name="folder-outline" size={24} color={colors.text} />}
            onPress={() =>
              router.push(
                `/agenda/agendaCategories?agendaId=${item.id}&title=${encodeURIComponent(decode(item.name))}`
              )
            }
          />
        ) : (
          <ListRow
            title={decode(`${formatDate(item.start_date_details)} ${item.title}`)}
            subtitle={formatEventTimeRange(item)}
            onPress={() => router.push({ pathname: '/agenda/[agendaEntry]', params: { agendaEntry: item.id } })}
          />
        )
      }
    />
  );
}
